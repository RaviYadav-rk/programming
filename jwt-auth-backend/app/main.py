from fastapi import FastAPI

from sqlalchemy import text

from app.database import engine


app = FastAPI(
    title="JWT Authentication API",
)


@app.get("/")
def root():
    return {"message": "JWT Authentication API is running"}


@app.get("/db-test")
def database_test():

    with engine.connect() as connection:

        result = connection.execute(text("SELECT 1"))

        value = result.scalar()

    return {
        "database": "connected",
        "result": value,
    }
