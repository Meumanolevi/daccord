"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { helpSuggestions } from "@/lib/help-assistant";
import type { HelpResponse } from "@/types/api";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

const initialMessage: ChatMessage = {
  id: 1,
  role: "assistant",
  text: "Olá. Sou o assistente D’Accord. Posso orientar você sobre como iniciar a análise, enviar uma foto e entender suas recomendações.",
};

export function HelpChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const messageId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("assistente") !== "aberto") return;
    const timer = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, busy, reduceMotion]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const sendMessage = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;

    messageId.current += 1;
    setMessages((current) => [
      ...current,
      { id: messageId.current, role: "user", text: message },
    ]);
    setInput("");
    setBusy(true);

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Help assistant unavailable");
      const data = (await response.json()) as HelpResponse;
      messageId.current += 1;
      setMessages((current) => [
        ...current,
        { id: messageId.current, role: "assistant", text: data.reply },
      ]);
    } catch {
      messageId.current += 1;
      setMessages((current) => [
        ...current,
        {
          id: messageId.current,
          role: "assistant",
          text: "Não consegui responder agora. Você ainda pode acessar “Analisar minha pele” para conhecer as etapas disponíveis.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div id="assistente" className="help-chatbot">
      <AnimatePresence>
        {open ? (
          <motion.section
            id="help-chatbot-panel"
            className="help-chatbot__panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="help-chatbot-title"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="help-chatbot__header">
              <div>
                <p id="help-chatbot-title">ASSISTENTE D’ACCORD</p>
                <span><i aria-hidden="true" /> AJUDA DISPONÍVEL</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar assistente">
                ×
              </button>
            </header>

            <div ref={transcriptRef} className="help-chatbot__transcript" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`help-chatbot__message help-chatbot__message--${message.role}`}
                >
                  <span>{message.role === "assistant" ? "D’ACCORD" : "VOCÊ"}</span>
                  <p>{message.text}</p>
                </div>
              ))}
              {busy ? (
                <div className="help-chatbot__message help-chatbot__message--assistant">
                  <span>D’ACCORD</span>
                  <p>ORGANIZANDO A RESPOSTA…</p>
                </div>
              ) : null}
            </div>

            <div className="help-chatbot__suggestions" aria-label="Dúvidas frequentes">
              {helpSuggestions.slice(0, 3).map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => void sendMessage(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>

            <form className="help-chatbot__form" onSubmit={handleSubmit}>
              <label htmlFor="help-chatbot-input">ESCREVA SUA DÚVIDA</label>
              <div>
                <input
                  ref={inputRef}
                  id="help-chatbot-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ex.: como começo a análise?"
                  maxLength={500}
                  autoComplete="off"
                />
                <button type="submit" disabled={busy || !input.trim()} aria-label="Enviar dúvida">
                  ENVIAR
                </button>
              </div>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        className="help-chatbot__launcher"
        aria-label={open ? "Fechar assistente D’Accord" : "Abrir assistente D’Accord"}
        aria-expanded={open}
        aria-controls="help-chatbot-panel"
        onClick={() => setOpen((current) => !current)}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={reduceMotion ? undefined : { y: -2, backgroundColor: "#9d286f" }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      >
        <span aria-hidden="true">?</span>
        <strong>AJUDA</strong>
      </motion.button>
    </div>
  );
}
