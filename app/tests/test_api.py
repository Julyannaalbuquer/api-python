import pytest
import json
import os
from httpx import AsyncClient
from app.main import app
from httpx import ASGITransport

@pytest.mark.asyncio
async def test_criar_e_listar_usuario():
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as cliente:
        usuario_exemplo = {
            "nome": "Julyanna",
            "sobrenome": "Albuquerque",
            "email": "julyanna@gmail.com",
            "senha": "Senha123!"
        }

        resposta_criar = await cliente.post("/login/", json=usuario_exemplo)
        assert resposta_criar.status_code == 200

        dados_usuario = resposta_criar.json()
        assert dados_usuario["nome"] == usuario_exemplo["nome"]
        assert dados_usuario["sobrenome"] == usuario_exemplo["sobrenome"]
        assert dados_usuario["email"] == usuario_exemplo["email"]

        resposta_listar = await cliente.get("/login/")
        assert resposta_listar.status_code == 200
        lista_usuarios = resposta_listar.json()
        assert isinstance(lista_usuarios, list)

        caminho_arquivo = os.path.join(os.path.dirname(__file__), "resultado_get.json")
        with open(caminho_arquivo, "w", encoding="utf-8") as arquivo:
            json.dump(lista_usuarios, arquivo, ensure_ascii=False, indent=2)

@pytest.mark.asyncio
async def test_deletar_usuario():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as cliente:
        novo_usuario = {
            "nome": "ParaDeletar",
            "sobrenome": "Teste",
            "email": "deletar@teste.com",
            "senha": "Senha123!"
        }

        resposta_criar = await cliente.post("/login/", json=novo_usuario)
        assert resposta_criar.status_code == 200
        usuario_criado = resposta_criar.json()
        id_usuario = usuario_criado["id"]

        resposta_delete = await cliente.delete(f"/login/{id_usuario}")
        assert resposta_delete.status_code == 200
        assert resposta_delete.json()["mensagem"] == "Usuário deletado com sucesso"

        caminho_arquivo = os.path.join(os.path.dirname(__file__), "resultado_delete.json")
        with open(caminho_arquivo, "w", encoding="utf-8") as arquivo:
            json.dump(resposta_delete.json(), arquivo, ensure_ascii=False, indent=2)
