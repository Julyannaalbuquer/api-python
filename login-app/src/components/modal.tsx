"use client";

import React from "react";
import "./modal.css";

interface ModalProps {
  titulo?: string;
  mensagem: string;
  onClose: () => void;
  onConfirm?: () => void;
  icone?: "info" | "delete" | "check";
  exibirConfirmacao?: boolean;
  textoConfirmacao?: string;
  textoCancelamento?: string;
}

const iconesSVG: Record<string, React.ReactNode> = {
  info: (
    <path
      d="M20 7L9.00004 18L3.99994 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  delete: (
    <path
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  check: (
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export default function Modal({
  titulo = "Aviso",
  mensagem,
  onClose,
  onConfirm,
  icone = "info",
  exibirConfirmacao = false,
  textoConfirmacao = "Confirmar",
  textoCancelamento = "Cancelar",
}: ModalProps) {
  return (
    <div className="overlay">
      <div className="card">
        <button className="dismiss" onClick={onClose}>×</button>

        <div className="header">
          <div className={`image ${icone}`}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
            >
              {iconesSVG[icone]}
            </svg>
          </div>

          <div className="content">
            <span className="title-modal">{titulo}</span>
            <p className="message">{mensagem}</p>
          </div>

          {exibirConfirmacao && onConfirm && (
            <div className="actions">
              <button className="desactivate" onClick={onConfirm}>
                {textoConfirmacao}
              </button>
              <button className="cancel" onClick={onClose}>
                {textoCancelamento}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
