import uuid
from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class FiskekortBase(BaseModel):
    type: str
    redskap: str
    gyldig_fra: date
    gyldig_til: date


class FiskekortCreate(FiskekortBase):
    pass


class FiskekortResponse(FiskekortBase):
    id: uuid.UUID
    status: str
    qr_kode: str

    model_config = ConfigDict(from_attributes=True)


class BetalingBase(BaseModel):
    metode: str


class BetalingCreate(BetalingBase):
    fiskekort_id: uuid.UUID


class BetalingCheckoutRequest(BaseModel):
    epost: EmailStr
    navn: str
    type: str
    redskap: str
    gyldig_fra: date
    gyldig_til: date


class CheckoutResponse(BaseModel):
    checkout_url: str
    betaling_id: uuid.UUID


class BetalingStatusResponse(BaseModel):
    betaling_id: uuid.UUID
    betaling_status: str
    fiskekort_id: uuid.UUID
    fiskekort_status: str
    qr_kode: str
    type: str
    redskap: str
    gyldig_fra: date
    gyldig_til: date
    epost: str
    navn: str


class BetalingResponse(BetalingBase):
    id: uuid.UUID
    status: str

    model_config = ConfigDict(from_attributes=True)


class BrukerBase(BaseModel):
    navn: str
    epost: EmailStr


class BrukerCreate(BrukerBase):
    passord: str


class BrukerResponse(BrukerBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
