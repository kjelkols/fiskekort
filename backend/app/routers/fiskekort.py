import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Fiskekort, Bruker
from app.schemas import FiskekortCreate, FiskekortResponse
from app.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[FiskekortResponse])
def list_fiskekort(
    db: Session = Depends(get_db),
    bruker: Bruker = Depends(get_current_user),
):
    """List alle fiskekort for innlogget bruker."""
    return db.query(Fiskekort).filter(Fiskekort.bruker_id == bruker.id).all()


@router.post("/", response_model=FiskekortResponse, status_code=201)
def create_fiskekort(
    data: FiskekortCreate,
    db: Session = Depends(get_db),
    bruker: Bruker = Depends(get_current_user),
):
    """Opprett nytt fiskekort for innlogget bruker."""
    fiskekort = Fiskekort(
        id=uuid.uuid4(),
        type=data.type,
        redskap=data.redskap,
        gyldig_fra=data.gyldig_fra,
        gyldig_til=data.gyldig_til,
        status="fremtidig",
        qr_kode=str(uuid.uuid4()),
        bruker_id=bruker.id,
        epost=bruker.epost,
        navn=bruker.navn,
    )
    db.add(fiskekort)
    db.commit()
    db.refresh(fiskekort)
    return fiskekort


@router.get("/{id}", response_model=FiskekortResponse)
def get_fiskekort(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    bruker: Bruker = Depends(get_current_user),
):
    """Hent detaljer om et fiskekort (kun egne)."""
    fiskekort = (
        db.query(Fiskekort)
        .filter(Fiskekort.id == id, Fiskekort.bruker_id == bruker.id)
        .first()
    )
    if not fiskekort:
        raise HTTPException(status_code=404, detail="Fiskekort ikke funnet")
    return fiskekort
