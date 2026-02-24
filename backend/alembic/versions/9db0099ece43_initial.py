"""initial

Revision ID: 9db0099ece43
Revises: 
Create Date: 2026-02-24 14:45:36.553378

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlalchemy.dialects.postgresql as pg


# revision identifiers, used by Alembic.
revision: str = '9db0099ece43'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "bruker",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("navn", sa.String(), nullable=False),
        sa.Column("epost", sa.String(), nullable=False, unique=True),
        sa.Column("passord_hash", sa.String(), nullable=False),
        sa.Column("opprettet", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "fiskekort",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("bruker_id", pg.UUID(as_uuid=True), sa.ForeignKey("bruker.id"), nullable=False),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("redskap", sa.String(), nullable=False),
        sa.Column("gyldig_fra", sa.Date(), nullable=False),
        sa.Column("gyldig_til", sa.Date(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("qr_kode", sa.String(), nullable=False, unique=True),
        sa.Column("opprettet", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "betaling",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("fiskekort_id", pg.UUID(as_uuid=True), sa.ForeignKey("fiskekort.id"), nullable=False),
        sa.Column("metode", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("transaksjon", sa.String(), nullable=True),
        sa.Column("opprettet", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("betaling")
    op.drop_table("fiskekort")
    op.drop_table("bruker")
