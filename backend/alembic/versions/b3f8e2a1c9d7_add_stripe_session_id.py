"""add stripe_session_id to betaling

Revision ID: b3f8e2a1c9d7
Revises: 9db0099ece43
Create Date: 2026-02-24 16:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "b3f8e2a1c9d7"
down_revision: Union[str, None] = "9db0099ece43"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "betaling",
        sa.Column("stripe_session_id", sa.String(), nullable=True, unique=True),
    )


def downgrade() -> None:
    op.drop_column("betaling", "stripe_session_id")
