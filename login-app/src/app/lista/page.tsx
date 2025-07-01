"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "../../components/modal";
import styles from "./lista.module.css";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export default function Lista() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalMensagem, setModalMensagem] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const tituloModal = confirmDeleteId ? "Excluir usuário" : "Operação realizada com sucesso!";

  const fetchUsuarios = () => {
    fetch("http://localhost:8000/login/")
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
    setModalMensagem("Deseja realmente deletar este usuário?");
    setModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId === null) return;

    const res = await fetch(`http://localhost:8000/login/${confirmDeleteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUsuarios(usuarios.filter((u) => u.id !== confirmDeleteId));
      setModalMensagem("Usuário deletado com sucesso!");
    } else {
      setModalMensagem("Erro ao deletar usuário.");
    }

    setConfirmDeleteId(null);
    setTimeout(() => {
      setModalVisible(false);
    }, 1500);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalMensagem("");
    setConfirmDeleteId(null);
  };

  return (
    <main className={styles["list-container"]}>
      <h2 className="title">Lista de Usuários</h2>

      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            <Link href={`/verificar/${usuario.id}`} className={styles["user-link"]}>
              👤 {usuario.nome} — 📧 {usuario.email}
            </Link>
            <button
              className={styles["btn-delete"]}
              onClick={() => handleDeleteClick(usuario.id)}
              aria-label={`Deletar usuário ${usuario.nome}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <Link href="/" className={styles["button-list"]}>
        ← Voltar
      </Link>

      {modalVisible && (
        <Modal
          mensagem={modalMensagem}
          onClose={closeModal}
          titulo= {tituloModal}
          onConfirm={confirmDeleteId !== null ? handleConfirmDelete : undefined}
          icone={confirmDeleteId !== null ? "delete" : "info"}
          exibirConfirmacao={true}
          textoConfirmacao="Excluir"
          textoCancelamento="Cancelar"
        />
      )}
    </main>
  );
}
