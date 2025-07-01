from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas import Usuario
from app.models.models import Usuario
import bcrypt

def listar_usuarios_service(db: Session):
    usuarios = db.query(Usuario).all()
    return [usuario_to_dict(usuario) for usuario in usuarios]

def buscar_usuario_por_id_service(usuario_id: int, db: Session):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario_to_dict(usuario)

def criar_usuario_service(usuario: Usuario, db: Session):
    existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Usuário já cadastrado")

    senha_hash = bcrypt.hashpw(usuario.senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    novo_usuario = Usuario(
        nome=usuario.nome,
        sobrenome=usuario.sobrenome,
        email=usuario.email,
        senha=senha_hash
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return usuario_to_dict(novo_usuario)

def atualizar_usuario_service(usuario_id: int, usuario: Usuario, db: Session):
    usuario_db = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    usuario_db.nome = usuario.nome
    usuario_db.sobrenome = usuario.sobrenome
    usuario_db.email = usuario.email
    
    if usuario.senha:
        usuario_db.senha = bcrypt.hashpw(usuario.senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    db.commit()
    db.refresh(usuario_db)
    return usuario_to_dict(usuario_db)

def atualizar_senha_service(usuario_id: int, nova_senha: str, db):
    usuario_db = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    senha_hash = bcrypt.hashpw(nova_senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    usuario_db.senha = senha_hash
    db.commit()
    db.refresh(usuario_db)

    return {"mensagem": "Senha atualizada com sucesso"}

def deletar_usuario_service(usuario_id: int, db: Session):
    usuario_db = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    db.delete(usuario_db)
    db.commit()
    return {"mensagem": "Usuário deletado com sucesso"}

def usuario_to_dict(usuario: Usuario):
    return {
        "id": usuario.id,
        "nome": usuario.nome,
        "sobrenome": usuario.sobrenome,
        "email": usuario.email,
        "senha": usuario.senha
    }
