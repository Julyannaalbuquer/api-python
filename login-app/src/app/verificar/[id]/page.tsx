"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import bcrypt from "bcryptjs";

export default function VerificarSenha({ params }: { params: Promise<{ id: string }> }) {
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState<any>(null);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mensagemCor, setMensagemCor] = useState("");
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    fetch(`http://localhost:8000/login/${id}`)
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((err) => setErro("Erro ao buscar usuário"));
  }, [id]);

  const verificarSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/login/${id}`);
      const usuario = await res.json();

      if (bcrypt.compareSync(senha, usuario.senha)) {
        setMensagem("Senha correta! Redirecionando para edição...");
        setMensagemCor("green");
        setTimeout(() => router.push(`/editar/${id}`), 100);
      } else {
        setMensagem("Senha incorreta. Tente novamente.");
        setMensagemCor("red");
      }
    } catch {
      setMensagem("Erro ao verificar usuário.");
      setMensagemCor("red");
    }
  };

  if (!usuario) return <p>Carregando usuário...</p>;

  return (
    <main className="form-container" style={{ padding: 20,  maxWidth: 360, margin: "40px auto" }}>
      <h3 className="title" style={{fontSize: 22, marginBottom: 9, marginTop: 9}}>Confirme sua senha para editar</h3>
      <form className="form" onSubmit={verificarSenha}>
        <div className="input-group">
           <label htmlFor="senha">Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ padding: 8, width: "320px" }}
          />
          
          {mensagem && (
            <p style={{ color: mensagemCor, marginTop: 8 }}>{mensagem}</p>
          )}
        </div>

        <br />
        <button className="button" type="submit" style={{padding: 8, width: 150, marginLeft: 84, marginTop: -20}}>
          Confirmar
        </button>
        <p className="signup"><Link  href="/lista" style={{ marginTop: 10 }}>
          Voltar
        </Link></p>
      </form>
      {erro && <p style={{ color: "red", marginTop: 10 }}>{erro}</p>}
    </main>
  );
}
