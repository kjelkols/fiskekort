import os
from datetime import datetime, timedelta, UTC
from typing import Optional

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Bruker

SECRET_KEY = os.getenv("SECRET_KEY", "bytt-meg-i-produksjon")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 timer

_ph = PasswordHasher()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hash_passord(passord: str) -> str:
    return _ph.hash(passord)


def verifiser_passord(passord: str, passord_hash: str) -> bool:
    try:
        return _ph.verify(passord_hash, passord)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def lag_access_token(data: dict, utloper_om: Optional[timedelta] = None) -> str:
    payload = data.copy()
    utloper = datetime.now(UTC) + (utloper_om or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload.update({"exp": utloper})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Bruker:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Ugyldig eller utløpt token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        bruker_id: str = payload.get("sub")
        if bruker_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    bruker = db.query(Bruker).filter(Bruker.epost == bruker_id).first()
    if bruker is None:
        raise credentials_exception
    return bruker
