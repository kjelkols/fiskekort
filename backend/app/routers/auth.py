import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Bruker
from app.schemas import BrukerCreate, BrukerResponse, TokenResponse
from app.auth import hash_passord, verifiser_passord, lag_access_token

router = APIRouter()


@router.post("/register", response_model=BrukerResponse, status_code=201)
def register(data: BrukerCreate, db: Session = Depends(get_db)):
    """Registrer ny bruker."""
    eksisterende = db.query(Bruker).filter(Bruker.epost == data.epost).first()
    if eksisterende:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-postadressen er allerede registrert",
        )
    bruker = Bruker(
        id=uuid.uuid4(),
        navn=data.navn,
        epost=data.epost,
        passord_hash=hash_passord(data.passord),
    )
    db.add(bruker)
    db.commit()
    db.refresh(bruker)
    return bruker


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Logg inn og få JWT-token. Bruk e-post som brukernavn."""
    bruker = db.query(Bruker).filter(Bruker.epost == form_data.username).first()
    if not bruker or not verifiser_passord(form_data.password, bruker.passord_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Feil e-post eller passord",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = lag_access_token({"sub": bruker.epost})
    return {"access_token": token, "token_type": "bearer"}
