from sqlalchemy import Column, Integer, String
from pydantic import BaseModel
from typing import Optional
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    sobrenome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha = Column(String, nullable=False)

class UsuarioEdicao(BaseModel):
    nome: str
    sobrenome: str
    email: str
    senha: Optional[str] = None