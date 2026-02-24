import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import get_db
from app.models import Base, Bruker
from app.auth import hash_passord

# Bruk SQLite i minnet for tester
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

TEST_EPOST = "test@fiskekort.no"
TEST_PASSORD = "testpassord123"


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def auth_client(db):
    """TestClient med innlogget bruker – returnerer (client, token)."""
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        # Registrer bruker om den ikke finnes
        eksisterende = db.query(Bruker).filter(Bruker.epost == TEST_EPOST).first()
        if not eksisterende:
            bruker = Bruker(
                id=uuid.uuid4(),
                navn="Test Bruker",
                epost=TEST_EPOST,
                passord_hash=hash_passord(TEST_PASSORD),
            )
            db.add(bruker)
            db.commit()

        login_res = c.post(
            "/api/auth/login",
            data={"username": TEST_EPOST, "password": TEST_PASSORD},
        )
        token = login_res.json()["access_token"]
        c.headers.update({"Authorization": f"Bearer {token}"})
        yield c

    app.dependency_overrides.clear()
