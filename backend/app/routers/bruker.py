from fastapi import APIRouter

router = APIRouter()


@router.get("/me")
def get_me():
    """Hent innlogget brukers info."""
    # TODO: Implementer autentisering
    return {"message": "Autentisering ikke implementert ennå"}


@router.post("/slett")
def slett_bruker():
    """Slett brukerdata (GDPR)."""
    # TODO: Implementer sletting av brukerdata
    return {"message": "Slett bruker ikke implementert ennå"}
