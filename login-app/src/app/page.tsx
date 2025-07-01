"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "../components/modal";
import bcrypt from "bcryptjs";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modalMensagem, setModalMensagem] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/login/");
      const usuarios = await res.json();

      const usuarioEncontrado = usuarios.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (
        usuarioEncontrado &&
        bcrypt.compareSync(senha, usuarioEncontrado.senha)
      ) {
        setModalMensagem(`Bem-vindo(a), ${usuarioEncontrado.nome}!`);
        setTimeout(() => router.push("/lista"), 1000);
      } else {
        setModalMensagem("Email ou senha incorretos. Tente novamente ou cadastre-se.");
        setModalVisible(true);
      }
    } catch (err) {
      setModalMensagem("Erro ao conectar com o servidor.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalMensagem("");
  };

  return (
    <div className="form-container">
      <p className="title">Login</p>
      <form className="form" onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="senha">Senha</label>
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

          <div className="forgot">
            <a rel="noopener noreferrer" href="/recuperar-senha">Esqueceu a senha?</a>
          </div>
        </div>
        <button type="submit" className="button">Entrar</button>
      </form>
      <p className="signup">
        Não tem uma conta?{" "}
        <Link href="/cadastro">Cadastre-se</Link>
      </p>

      {modalVisible && <Modal mensagem={modalMensagem} onClose={closeModal} titulo="Dados incorretos!" icone="delete"/>}
    </div>
  );
}
