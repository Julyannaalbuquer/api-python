from pydantic import BaseModel, EmailStr, field_validator
import re

class Usuario(BaseModel):
    nome: str
    sobrenome: str
    email: EmailStr
    senha: str

    @field_validator('senha')
    def senha_forte(cls, v):
        if len(v) < 6:
            raise ValueError('A senha deve ter ao menos 6 caracteres.')
        if not re.search(r'[A-Z]', v):
            raise ValueError('A senha deve conter pelo menos uma letra maiúscula.')
        if not re.search(r'[a-z]', v):
            raise ValueError('A senha deve conter pelo menos uma letra minúscula.')
        if not re.search(r'[0-9]', v):
            raise ValueError('A senha deve conter pelo menos um número.')
        if not re.search(r'[\W_]', v):
            raise ValueError('A senha deve conter pelo menos um caractere especial.')
        return v

class SenhaAtualizacao(BaseModel):
    senha: str

    @field_validator('senha')
    def senha_forte(cls, v):
        if len(v) < 6:
            raise ValueError('A senha deve ter ao menos 6 caracteres.')
        if not re.search(r'[A-Z]', v):
            raise ValueError('A senha deve conter pelo menos uma letra maiúscula.')
        if not re.search(r'[a-z]', v):
            raise ValueError('A senha deve conter pelo menos uma letra minúscula.')
        if not re.search(r'[0-9]', v):
            raise ValueError('A senha deve conter pelo menos um número.')
        if not re.search(r'[\W_]', v):
            raise ValueError('A senha deve conter pelo menos um caractere especial.')
        return v