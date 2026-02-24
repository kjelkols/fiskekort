from datetime import date


def test_kontroller_qr_not_found(client):
    response = client.get("/api/kontroll/qr/ugyldig-kode")
    assert response.status_code == 404


def test_kontroller_qr_gyldig(auth_client, client):
    # Opprett fiskekort som innlogget bruker
    data = {
        "type": "dagskort",
        "redskap": "stang",
        "gyldig_fra": str(date.today()),
        "gyldig_til": str(date.today()),
    }
    create_response = auth_client.post("/api/fiskekort/", json=data)
    qr_kode = create_response.json()["qr_kode"]

    # Kontroll-endepunktet krever ikke innlogging
    response = client.get(f"/api/kontroll/qr/{qr_kode}")
    assert response.status_code == 200
    body = response.json()
    assert "gyldig" in body
    assert "status" in body


def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Fiskekort API er oppe og kjører"
