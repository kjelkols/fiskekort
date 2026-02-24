import uuid
from datetime import date, datetime, UTC
from enum import Enum

from sqlalchemy import Column, Date, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class FiskekortStatus(str, Enum):
    aktiv = "aktiv"
    fremtidig = "fremtidig"
    utgatt = "utgått"


class BetalingStatus(str, Enum):
    pending = "pending"
    fullfort = "fullført"
    feilet = "feilet"


class Bruker(Base):
    __tablename__ = "bruker"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    navn = Column(String, nullable=False)
    epost = Column(String, nullable=False, unique=True)
    passord_hash = Column(String, nullable=False)
    opprettet = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)

    fiskekort = relationship("Fiskekort", back_populates="bruker")


class Fiskekort(Base):
    __tablename__ = "fiskekort"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bruker_id = Column(UUID(as_uuid=True), ForeignKey("bruker.id"), nullable=True)
    epost = Column(String, nullable=False)
    navn = Column(String, nullable=False)
    type = Column(String, nullable=False)
    redskap = Column(String, nullable=False)
    gyldig_fra = Column(Date, nullable=False)
    gyldig_til = Column(Date, nullable=False)
    status = Column(String, nullable=False, default=FiskekortStatus.fremtidig)
    qr_kode = Column(String, nullable=False, unique=True)
    opprettet = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)

    bruker = relationship("Bruker", back_populates="fiskekort")
    betaling = relationship("Betaling", back_populates="fiskekort", uselist=False)


class Betaling(Base):
    __tablename__ = "betaling"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fiskekort_id = Column(UUID(as_uuid=True), ForeignKey("fiskekort.id"), nullable=False)
    metode = Column(String, nullable=False)
    status = Column(String, nullable=False, default=BetalingStatus.pending)
    transaksjon = Column(String, nullable=True)
    stripe_session_id = Column(String, nullable=True, unique=True)
    opprettet = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)

    fiskekort = relationship("Fiskekort", back_populates="betaling")
