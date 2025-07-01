"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../../components/modal";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const router = useRouter();

  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
  const temSeisOuMais = senha.length >= 6;

  const senhaValida =
    temMaiuscula && temMinuscula && temNumero && temEspecial && temSeisOuMais;

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senhaValida) {
      setMensagem("Senha não atende aos requisitos.");
      return;
    }
    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    const res = await fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, sobrenome, email, senha }),
    });

    if (res.ok) {
      setMensagem("Cadastro realizado com sucesso!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setMensagem("Erro ao cadastrar.");
    }
  };

  return (
    <main className="form-container">
      <h2 className="title">Cadastro</h2>
      <form onSubmit={handleCadastro} className="form">
        <div className="input-group">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Sobrenome</label>
          <input
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Senha</label>
          <div style={{ position: "relative" }}>
            <input
              type={mostrarSenha ? "text" : "password"}
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ paddingRight: "40px" }}
            />
            <span className="icone-olho"
              onClick={() => setMostrarSenha((prev) => !prev)}
            >
              {mostrarSenha ? <FiEyeOff/> : <FiEye/>}
            </span>
          </div>
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
          <div style={{ position: "relative" }}>
            <input
              type={mostrarSenha ? "text" : "password"}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              style={{ paddingRight: "40px" }}
            />
            <span className="icone-olho"
              onClick={() => setMostrarSenha((prev) => !prev)}
            >
              {mostrarSenha ? <FiEyeOff/> : <FiEye/>}
            </span>
          </div>
        </div>

        {senha && confirmarSenha && (
          <p
            style={{
              color: senha === confirmarSenha ? "green" : "red",
              marginTop: "5px",
              fontSize: "12px",
            }}
          >
            {senha === confirmarSenha
              ? "✔ As senhas coincidem"
              : "❌ As senhas não coincidem"}
          </p>
        )}

        <button type="submit" className="button" style={{ marginTop: "12px" }}>
          Cadastrar
        </button>
      </form>

      {mensagem && (
        <Modal mensagem={mensagem}  titulo="Sucesso!" onClose={() => setMensagem("")} />
      )}

      <div className="signup" style={{ marginTop: "20px" }}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
        >
          Voltar
        </a>
      </div>
    </main>
  );
}
