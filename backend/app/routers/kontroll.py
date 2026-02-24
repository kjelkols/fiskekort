import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Fiskekort

router = APIRouter()


@router.get("/qr/{kode}")
def kontroller_qr(kode: str, db: Session = Depends(get_db)):
    """Sjekk gyldighet for fiskekort via QR-kode."""
    fiskekort = db.query(Fiskekort).filter(Fiskekort.qr_kode == kode).first()
    if not fiskekort:
        raise HTTPException(status_code=404, detail="Fiskekort ikke funnet")
    return {
        "gyldig": fiskekort.status == "aktiv",
        "status": fiskekort.status,
        "type": fiskekort.type,
        "redskap": fiskekort.redskap,
        "gyldig_fra": fiskekort.gyldig_fra,
        "gyldig_til": fiskekort.gyldig_til,
    }
