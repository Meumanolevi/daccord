"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import styles from "./auth-experience.module.css";

type AuthStep = "email" | "password" | "register" | "verify" | "success" | "recovery";

export function AuthExperience() {
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const continueWithEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Digite um e-mail válido para continuar.");
      return;
    }
    setStep("password");
  };

  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password")?.toString() ?? "";
    if (password.length < 8) {
      setError("Use pelo menos 8 caracteres para esta demonstração.");
      return;
    }
    setError("");
    setStep("success");
  };

  const submitRegistration = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("new-password")?.toString() ?? "";
    const accepted = data.get("terms") === "on";
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || password.length < 10 || !accepted) {
      setError("Preencha os dados, crie uma senha com 10 caracteres e aceite os termos.");
      return;
    }
    setError("");
    setStep("verify");
  };

  const submitCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("code")?.toString() ?? "";
    if (!/^\d{6}$/.test(code)) {
      setError("Digite os seis números enviados para o seu e-mail.");
      return;
    }
    setError("");
    setStep("success");
  };

  const submitRecovery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Digite o e-mail usado na sua conta.");
      return;
    }
    setError("");
    setStep("email");
    showNotice("Se a conta existir, as instruções de recuperação serão enviadas.");
  };

  const returnToEmail = () => {
    setError("");
    setStep("email");
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← <span>Voltar à loja</span></Link>
        <Link href="/" className={styles.wordmark} aria-label="D’Accord — página inicial">D’ACCORD</Link>
        <Link href="/contato" className={styles.help}><span>Precisa de ajuda?</span> ?</Link>
      </header>

      <section className={styles.shell} aria-labelledby="auth-title">
        <figure className={styles.visual}>
          <Image src="/images/closing-portrait.png" alt="Pessoa de perfil em uma composição rosada da D’Accord" fill priority sizes="(max-width: 767px) 100vw, 44vw" />
          <figcaption className={styles.visualCopy}>
            <p>Conta D’Accord</p>
            <h2>Seu cuidado continua de onde parou.</h2>
            <span>Salvar uma análise é uma escolha. Navegar e conhecer os produtos continua disponível sem cadastro.</span>
            <ul>
              <li><b>01</b> Histórico de análises e explicações</li>
              <li><b>02</b> Curadorias, favoritos e pedidos</li>
              <li><b>03</b> Consentimentos e dados sob controle</li>
            </ul>
          </figcaption>
        </figure>

        <section className={styles.formColumn}>
          <div className={styles.card}>
            <div className={styles.progress} aria-label="Progresso do acesso">
              <i className={styles.active} /><i className={step !== "email" ? styles.active : ""} /><i className={step === "verify" || step === "success" ? styles.active : ""} /><span>Acesso seguro</span>
            </div>

            {step === "email" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Entrar ou criar conta</p><h1 id="auth-title">Comece pelo seu e-mail.</h1><p>Primeiro identificamos o próximo passo. Nenhuma mensagem será enviada sem confirmação.</p>
              <form onSubmit={continueWithEmail} noValidate><Field label="E-mail" htmlFor="auth-email" error={error}><input id="auth-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" /></Field><button className={styles.primary} type="submit">Continuar</button></form>
              <div className={styles.separator}>ou</div>
              <button className={styles.social} type="button" onClick={() => showNotice("Acesso com Google será ativado junto ao backend.")}><span>G</span> Continuar com Google</button>
              <button className={styles.social} type="button" onClick={() => showNotice("Acesso com Apple será ativado junto ao backend.")}><span>●</span> Continuar com Apple</button>
            </div> : null}

            {step === "password" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Conta encontrada</p><h1 id="auth-title">Que bom ter você de volta.</h1><p>Entrando como <strong>{email}</strong>. <button type="button" className={styles.textButton} onClick={returnToEmail}>Trocar e-mail</button></p>
              <form onSubmit={submitPassword} noValidate><Field label="Senha" htmlFor="auth-password" error={error}><div className={styles.passwordField}><input id="auth-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Ocultar" : "Mostrar"}</button></div></Field><div className={styles.formOptions}><label><input type="checkbox" /> Manter conectado</label><button type="button" className={styles.textButton} onClick={() => { setError(""); setStep("recovery"); }}>Esqueci a senha</button></div><button className={styles.primary} type="submit">Entrar</button></form>
              <button className={styles.secondary} type="button" onClick={() => { setError(""); setStep("register"); }}>Ainda não tenho conta</button>
            </div> : null}

            {step === "register" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Nova conta</p><h1 id="auth-title">Crie seu acesso.</h1><p>Dados de acesso ficam separados das respostas e fotografias de uma análise.</p>
              <form onSubmit={submitRegistration} noValidate><Field label="Como podemos chamar você?" htmlFor="register-name"><input id="register-name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></Field><Field label="E-mail" htmlFor="register-email"><input id="register-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field><Field label="Crie uma senha" htmlFor="register-password" hint="Use pelo menos 10 caracteres e evite senhas reutilizadas." error={error}><div className={styles.passwordField}><input id="register-password" name="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Ocultar" : "Mostrar"}</button></div></Field><label className={styles.legal}><input name="terms" type="checkbox" /> <span>Li os <Link href="/privacidade">Termos e a Política de Privacidade</Link>. Marketing é opcional e será solicitado separadamente.</span></label><button className={styles.primary} type="submit">Criar conta</button></form>
              <button className={styles.textButton} type="button" onClick={() => setStep("password")}>Já tenho uma conta</button>
            </div> : null}

            {step === "verify" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Confirmar e-mail</p><h1 id="auth-title">Digite o código.</h1><p>Enviamos um código de seis números para <strong>{email}</strong>. Ele expira em dez minutos.</p>
              <form onSubmit={submitCode} noValidate><Field label="Código de verificação" htmlFor="verification-code" error={error}><input className={styles.codeInput} id="verification-code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" /></Field><button className={styles.primary} type="submit">Confirmar e-mail</button></form>
              <button className={styles.textButton} type="button" onClick={() => showNotice("Um novo código seria enviado em uma integração real.")}>Reenviar código</button>
            </div> : null}

            {step === "recovery" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Recuperar acesso</p><h1 id="auth-title">Vamos ajudar você a voltar.</h1><p>Por segurança, a resposta será a mesma exista ou não uma conta para o e-mail informado.</p>
              <form onSubmit={submitRecovery} noValidate><Field label="E-mail da conta" htmlFor="recovery-email" error={error}><input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field><button className={styles.primary} type="submit">Enviar instruções</button></form>
              <button className={styles.secondary} type="button" onClick={() => setStep("password")}>Voltar para entrar</button>
            </div> : null}

            {step === "success" ? <div className={styles.pane}>
              <span className={styles.successMark} aria-hidden="true">✓</span><p className={styles.eyebrow}>Acesso concluído</p><h1 id="auth-title">Tudo pronto, {name || "bem-vinda"}.</h1><p>A interface está preparada para receber a sessão real do backend. Você já pode continuar pela jornada do MVP.</p><Link href="/analise" className={styles.primaryLink}>Começar análise</Link><Link href="/produtos" className={styles.secondaryLink}>Explorar produtos</Link>
            </div> : null}

            <aside className={styles.integrationNote}>Interface do MVP pronta. Criação de sessão, envio de e-mail e provedores sociais dependem da integração com o backend.</aside>
          </div>
        </section>
      </section>

      <footer className={styles.footer}><span>Seus dados de acesso são protegidos e separados das fotografias da análise.</span><nav aria-label="Links legais"><Link href="/privacidade">Privacidade</Link><Link href="/contato">Ajuda</Link><Link href="/sobre">Sobre</Link></nav></footer>
      <div className={`${styles.toast} ${notice ? styles.toastVisible : ""}`} role="status" aria-live="polite">{notice}</div>
    </main>
  );
}

function Field({ label, htmlFor, hint, error, children }: { label: string; htmlFor: string; hint?: string; error?: string; children: ReactNode }) {
  return <div className={styles.field}><label htmlFor={htmlFor}>{label}</label>{children}{hint ? <span>{hint}</span> : null}{error ? <p role="alert">{error}</p> : null}</div>;
}
