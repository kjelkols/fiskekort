import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv(  # override=True sikrer at .env alltid vinner over shell-variabler
    Path(__file__).resolve().parent.parent / ".env", override=True)

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://bruker:passord@localhost:5432/fiskekort")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
