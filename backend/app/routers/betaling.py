import os
import uuid

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Betaling, Fiskekort, Bruker
from app.schemas import BetalingCheckoutRequest, BetalingStatusResponse, CheckoutResponse

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Priser i øre (NOK)
PRISER = {
    "dagskort": 15000,
    "ukeskort": 40000,
    "sesongkort": 80000,
}

KORTNAVN = {
    "dagskort": "Dagskort",
    "ukeskort": "Ukeskort",
    "sesongkort": "Sesongkort",
}


@router.post("/checkout", response_model=CheckoutResponse, status_code=201)
def initier_checkout(
    data: BetalingCheckoutRequest,
    db: Session = Depends(get_db),
):
    """Opprett Stripe Checkout Session og knytt til nytt fiskekort. Krever ikke innlogging."""
    if not stripe.api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Stripe er ikke konfigurert",
        )

    pris = PRISER.get(data.type, 15000)

    # Koble til eksisterende bruker hvis e-post er registrert
    bruker = db.query(Bruker).filter(Bruker.epost == str(data.epost)).first()

    fiskekort = Fiskekort(
        id=uuid.uuid4(),
        bruker_id=bruker.id if bruker else None,
        epost=str(data.epost),
        navn=data.navn,
        type=data.type,
        redskap=data.redskap,
        gyldig_fra=data.gyldig_fra,
        gyldig_til=data.gyldig_til,
        status="fremtidig",
        qr_kode=str(uuid.uuid4()),
    )
    db.add(fiskekort)
    db.flush()

    betaling = Betaling(
        id=uuid.uuid4(),
        fiskekort_id=fiskekort.id,
        metode="stripe",
        status="pending",
    )
    db.add(betaling)
    db.flush()

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "nok",
                        "unit_amount": pris,
                        "product_data": {
                            "name": KORTNAVN.get(data.type, data.type),
                            "description": f"{data.redskap} · {data.gyldig_fra} – {data.gyldig_til}",
                        },
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=f"{FRONTEND_URL}/fiskekort/bekreftelse?betaling_id={betaling.id}",
            cancel_url=f"{FRONTEND_URL}/fiskekort/kjop",
            metadata={"betaling_id": str(betaling.id)},
            customer_email=str(data.epost),
        )
    except stripe.StripeError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    betaling.stripe_session_id = session.id
    db.commit()

    return CheckoutResponse(checkout_url=session.url, betaling_id=betaling.id)


@router.post("/webhook")
async def betaling_webhook(request: Request, db: Session = Depends(get_db)):
    """Motta og valider Stripe-webhook. Oppdater betaling og fiskekort ved fullført betaling."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    if STRIPE_WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        except stripe.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Ugyldig Stripe-signatur")
    else:
        import json
        event = json.loads(payload)

    if event["type"] == "checkout.session.completed":
        session_obj = event["data"]["object"]
        betaling_id = session_obj.get("metadata", {}).get("betaling_id")
        if betaling_id:
            betaling = db.query(Betaling).filter(Betaling.id == betaling_id).first()
            if betaling:
                betaling.status = "fullført"
                betaling.transaksjon = session_obj.get("payment_intent")
                fiskekort = db.query(Fiskekort).filter(Fiskekort.id == betaling.fiskekort_id).first()
                if fiskekort:
                    fiskekort.status = "aktiv"
                db.commit()

    return {"ok": True}


@router.get("/{betaling_id}", response_model=BetalingStatusResponse)
def get_betaling_status(
    betaling_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    """Hent betalingsstatus og fiskekort-info via betaling-ID (ingen innlogging nødvendig)."""
    betaling = db.query(Betaling).filter(Betaling.id == betaling_id).first()
    if not betaling:
        raise HTTPException(status_code=404, detail="Betaling ikke funnet")

    fiskekort = db.query(Fiskekort).filter(
        Fiskekort.id == betaling.fiskekort_id,
    ).first()
    if not fiskekort:
        raise HTTPException(status_code=404, detail="Fiskekort ikke funnet")

    return BetalingStatusResponse(
        betaling_id=betaling.id,
        betaling_status=betaling.status,
        fiskekort_id=fiskekort.id,
        fiskekort_status=fiskekort.status,
        qr_kode=fiskekort.qr_kode,
        type=fiskekort.type,
        redskap=fiskekort.redskap,
        gyldig_fra=fiskekort.gyldig_fra,
        gyldig_til=fiskekort.gyldig_til,
        epost=fiskekort.epost,
        navn=fiskekort.navn,
    )

