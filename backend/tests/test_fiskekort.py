from datetime import date


def test_list_fiskekort_empty(auth_client):
    response = auth_client.get("/api/fiskekort/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_fiskekort(auth_client):
    data = {
        "type": "dagskort",
        "redskap": "stang",
        "gyldig_fra": str(date.today()),
        "gyldig_til": str(date.today()),
    }
    response = auth_client.post("/api/fiskekort/", json=data)
    assert response.status_code == 201
    body = response.json()
    assert body["type"] == "dagskort"
    assert body["redskap"] == "stang"
    assert "id" in body
    assert "qr_kode" in body


def test_get_fiskekort(auth_client):
    data = {
        "type": "ukeskort",
        "redskap": "garn",
        "gyldig_fra": str(date.today()),
        "gyldig_til": str(date.today()),
    }
    create_response = auth_client.post("/api/fiskekort/", json=data)
    fiskekort_id = create_response.json()["id"]

    response = auth_client.get(f"/api/fiskekort/{fiskekort_id}")
    assert response.status_code == 200
    assert response.json()["id"] == fiskekort_id


def test_get_fiskekort_not_found(auth_client):
    response = auth_client.get("/api/fiskekort/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_fiskekort_krever_innlogging(client):
    response = client.get("/api/fiskekort/")
    assert response.status_code == 401
