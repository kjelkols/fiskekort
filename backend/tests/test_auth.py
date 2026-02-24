from tests.conftest import TEST_EPOST, TEST_PASSORD


def test_register(client):
    response = client.post(
        "/api/auth/register",
        json={"navn": "Ny Bruker", "epost": "ny@fiskekort.no", "passord": "passord123"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["epost"] == "ny@fiskekort.no"
    assert "passord" not in body


def test_register_duplikat_epost(client):
    client.post(
        "/api/auth/register",
        json={"navn": "Bruker A", "epost": "duplikat@fiskekort.no", "passord": "passord123"},
    )
    response = client.post(
        "/api/auth/register",
        json={"navn": "Bruker B", "epost": "duplikat@fiskekort.no", "passord": "passord456"},
    )
    assert response.status_code == 400


def test_login(auth_client):
    # auth_client-fixture logger allerede inn; sjekk at token er gyldig
    response = auth_client.get("/api/fiskekort/")
    assert response.status_code == 200


def test_login_feil_passord(client):
    response = client.post(
        "/api/auth/login",
        data={"username": TEST_EPOST, "password": "feil-passord"},
    )
    assert response.status_code == 401


def test_login_ukjent_bruker(client):
    response = client.post(
        "/api/auth/login",
        data={"username": "finnes@ikke.no", "password": "passord"},
    )
    assert response.status_code == 401
