FROM python:3.13-slim

WORKDIR /app

# Installer uv
RUN pip install uv

# Kopier avhengigheter og installer
COPY requirements.txt .
RUN uv venv /app/.venv && \
    . /app/.venv/bin/activate && \
    uv pip install -r requirements.txt

# Kopier kildekode og Alembic-konfig
COPY app/ app/
COPY alembic/ alembic/
COPY alembic.ini .

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
