"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../../components/modal";
import Link from "next/link";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/login/");
    const usuarios = await res.json();

    const usuario = usuarios.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (usuario) {
      router.push(`/nova-senha?id=${usuario.id}`);
    } else {
      setMensagem("Email não encontrado. Verifique ou cadastre-se.");
    }
  };

  return (
    <main className="form-container" style={{ maxWidth: 350, margin: "40px auto" }}>
      <h2 className="title">Recuperar Senha</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{width: 290}}
            required
          />
        </div>
        <button className="button" style={{padding: 8, width: 150, marginLeft: 69, marginTop: 5}} type="submit">Enviar</button>
        <p className="signup"><Link  href="/" style={{ marginTop: 10 }}>
          Voltar
        </Link></p>
      </form>

      {mensagem && <Modal mensagem={mensagem} onClose={() => setMensagem("")} />}
    </main>
  );
}
