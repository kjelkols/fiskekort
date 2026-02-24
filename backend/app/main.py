from fastapi import FastAPI
from app.routers import fiskekort, betaling, bruker, kontroll, auth

app = FastAPI(
    title="Fiskekort API",
    description="API for administrasjon og kjøp av fiskekort",
    version="1.0.0",
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(fiskekort.router, prefix="/api/fiskekort", tags=["fiskekort"])
app.include_router(betaling.router, prefix="/api/betaling", tags=["betaling"])
app.include_router(bruker.router, prefix="/api/bruker", tags=["bruker"])
app.include_router(kontroll.router, prefix="/api/kontroll", tags=["kontroll"])


@app.get("/")
def root():
    return {"message": "Fiskekort API er oppe og kjører"}
