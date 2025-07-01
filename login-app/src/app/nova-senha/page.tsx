"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "../../components/modal";
import Link from "next/link";

export default function NovaSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const temMaiuscula = /[A-Z]/.test(novaSenha);
  const temMinuscula = /[a-z]/.test(novaSenha);
  const temNumero = /[0-9]/.test(novaSenha);
  const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(novaSenha);
  const temSeisOuMais = novaSenha.length >= 6;

  const senhaValida =
    temMaiuscula && temMinuscula && temNumero && temEspecial && temSeisOuMais;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    if (!senhaValida) {
      setMensagem("Senha não atende aos requisitos.");
      return;
    }

    const res = await fetch(`http://localhost:8000/login/${userId}/senha`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha: novaSenha }),
    });

    if (res.ok) {
      setMensagem("Senha atualizada com sucesso! Redirecionando para login...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setMensagem("Erro ao atualizar a senha.");
    }
  };

  return (
    <main className="form-container" style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2 className="title">Nova Senha</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => {
              setNovaSenha(e.target.value);
            }}
            required
          />
        </div>

        <div className="input-group" style={{ fontSize: "12px", lineHeight: 1.4 }}>
          <p style={{ color: temSeisOuMais ? "green" : "red" }}>
            {temSeisOuMais ? "✔" : "❌"} Mínimo 6 caracteres
          </p>
          <p style={{ color: temMaiuscula ? "green" : "red" }}>
            {temMaiuscula ? "✔" : "❌"} Uma letra maiúscula
          </p>
          <p style={{ color: temMinuscula ? "green" : "red" }}>
            {temMinuscula ? "✔" : "❌"} Uma letra minúscula
          </p>
          <p style={{ color: temNumero ? "green" : "red" }}>
            {temNumero ? "✔" : "❌"} Um número
          </p>
          <p style={{ color: temEspecial ? "green" : "red" }}>
            {temEspecial ? "✔" : "❌"} Um caractere especial
          </p>
        </div>

        <div className="input-group">
          <label>Confirmar Senha</label>
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
        </div>
        {novaSenha && confirmarSenha && (
          <p
            style={{
              color: novaSenha === confirmarSenha ? "green" : "red",
              marginTop: "2px",
              fontSize: "12px",
            }}
          >
            {novaSenha === confirmarSenha
              ? "✔ As senhas coincidem"
              : "❌ As senhas não coincidem"}
          </p>
        )}

        <button className="button" style={{fontSize: 13, marginTop: 9}} type="submit">Salvar Nova Senha</button>
        <p className="signup"><Link  href="/recuperar-senha" style={{ marginTop: 10 }}>
          Voltar
        </Link></p>
      </form>

      {mensagem && <Modal mensagem={mensagem} onClose={() => setMensagem("")} />}
    </main>
  );
}
