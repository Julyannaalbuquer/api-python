"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../../../components/modal";
import { use } from "react";
import Link from "next/link";

export default function EditarUsuario({ params }: { params: Promise<{ id: string }>}) {
  const router = useRouter();
  const { id } = use(params);
  const [mensagem, setMensagem] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [usuario, setUsuario] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8000/login/${id}`)
      .then((res) => res.json())
      .then((data) => setUsuario({
        nome: data.nome,
        sobrenome: data.sobrenome,
        email: data.email,
        senha: "",
      })
    );
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/login/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    if (res.ok) {
      setModalVisible(true)
      setMensagem("Cadastro realizado com sucesso!");
      setTimeout(()=> router.push("/lista"), 1500);
    } else {
      setMensagem("Erro ao atualizar usuário.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setMensagem("");
  };

  return (
    <main style={{ padding: 20}}>
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="title" style={{marginBottom: 10}}>Editar Usuário</h2>
        <div className="input-group">
            <label htmlFor="nome">Nome</label>
            <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={usuario.nome}
            onChange={handleChange}
            required
            />
        </div>
        <div className="input-group">
            <label htmlFor="sobrenome">Sobrenome</label>
            <input
            type="text"
            name="sobrenome"
            placeholder="Sobrenome"
            value={usuario.sobrenome}
            onChange={handleChange}
            required
            />
        </div>
        <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
            type="email"
            name="email"
            placeholder="Email"
            value={usuario.email}
            onChange={handleChange}
            required
            />
        </div>
        <div className="input-group">
            <label htmlFor="senha">Nova senha</label>
            <input
                type="password"
                id="senha"
                value={usuario.senha}
                onChange={(e) => setUsuario({ ...usuario, senha: e.target.value })}
                placeholder="Deixe em branco para manter a senha atual"
            />
        </div>
        <button className="button" type="submit">Salvar</button>
        <p className="signup"><Link  href="/" style={{ marginTop: 10 }}>
          Voltar
        </Link></p>
        
        {modalVisible && (<Modal mensagem={mensagem} titulo="Dados Atualizados!" onClose={closeModal}/>)}
      </form>
    </main>
  );
}
