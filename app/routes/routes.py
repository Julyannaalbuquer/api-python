from fastapi import APIRouter, Depends, HTTPException
from app.schemas import SenhaAtualizacao
from app.models.models import UsuarioEdicao
from sqlalchemy.orm import Session
from app.schemas import Usuario
from app.services.service import (
    listar_usuarios_service,
    buscar_usuario_por_id_service,
    criar_usuario_service,
    atualizar_usuario_service,
    deletar_usuario_service,
    atualizar_senha_service
)
from app.database import SessionLocal

router = APIRouter(prefix="/login", tags=["Login"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def listar_usuarios(db: Session = Depends(get_db)):
    return listar_usuarios_service(db)

@router.get("/{usuario_id}")
def buscar_usuario_por_id(usuario_id: int, db: Session = Depends(get_db)):
    return buscar_usuario_por_id_service(usuario_id, db)

@router.post("/")
def criar_usuario(usuario: Usuario, db: Session = Depends(get_db)):
    return criar_usuario_service(usuario, db)

@router.put("/{usuario_id}")
def atualizar_usuario(usuario_id: int, usuario: UsuarioEdicao, db: Session = Depends(get_db)):
    return atualizar_usuario_service(usuario_id, usuario, db)

@router.put("/{usuario_id}/senha")
def atualizar_senha(usuario_id: int, dados: SenhaAtualizacao, db: Session = Depends(get_db)):
    return atualizar_senha_service(usuario_id, dados.senha, db)

@router.delete("/{usuario_id}")
def deletar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return deletar_usuario_service(usuario_id, db)
