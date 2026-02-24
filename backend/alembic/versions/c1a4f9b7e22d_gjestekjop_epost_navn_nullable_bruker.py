"""gjestekjop epost navn nullable bruker

Revision ID: c1a4f9b7e22d
Revises: b3f8e2a1c9d7
Create Date: 2026-02-24 21:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c1a4f9b7e22d"
down_revision: Union[str, None] = "b3f8e2a1c9d7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Gjør bruker_id nullable – gjestekjøp trenger ikke konto
    op.alter_column("fiskekort", "bruker_id", nullable=True)

    # Legg til epost og navn på fiskekort (tom streng som server_default for eksisterende rader)
    op.add_column(
        "fiskekort",
        sa.Column("epost", sa.String(), nullable=False, server_default=""),
    )
    op.add_column(
        "fiskekort",
        sa.Column("navn", sa.String(), nullable=False, server_default=""),
    )
    # Fjern server_default etter at kolonner er lagt til
    op.alter_column("fiskekort", "epost", server_default=None)
    op.alter_column("fiskekort", "navn", server_default=None)


def downgrade() -> None:
    op.drop_column("fiskekort", "navn")
    op.drop_column("fiskekort", "epost")
    op.alter_column("fiskekort", "bruker_id", nullable=False)
