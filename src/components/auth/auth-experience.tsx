"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiError, apiRequest } from "@/lib/api-client";
import extra from "./auth-enhancements.module.css";
import styles from "./auth-experience.module.css";

type AuthStep = "email" | "password" | "register" | "verify" | "success" | "recovery";

export function AuthExperience() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedReturn = searchParams.get("retorno");
  const returnPath = requestedReturn?.startsWith("/") && !requestedReturn.startsWith("//")
    ? requestedReturn
    : null;
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => {
      if (!user.email_verified_at) {
        setStep("verify");
        return;
      }

      if (returnPath) {
        router.replace(returnPath);
        return;
      }

      if (user.role === "admin") {
        router.replace("/admin");
        return;
      }

      setStep("success");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [returnPath, router, user]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4200);
  };

  const clearErrors = () => {
    setError("");
    setFieldErrors({});
  };

  const handleError = (caught: unknown) => {
    if (caught instanceof ApiError) {
      setError(caught.message);
      setFieldErrors(caught.errors);
    } else {
      setError("Não foi possível conectar ao servidor. Verifique se o backend está em execução.");
    }
  };

  const continueWithEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Digite um e-mail válido para continuar.");
      return;
    }
    setStep("password");
  };

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      await apiRequest("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password: data.get("password")?.toString() ?? "",
          remember: data.get("remember") === "on",
        }),
      });
      const authenticatedUser = await refreshUser();
      setName(authenticatedUser?.name ?? "");
      setStep(authenticatedUser?.email_verified_at ? "success" : "verify");
    } catch (caught) {
      handleError(caught);
    } finally {
      setLoading(false);
    }
  };

  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await apiRequest("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          terms: data.get("terms") === "on",
        }),
      });
      await refreshUser();
      setStep("verify");
    } catch (caught) {
      handleError(caught);
    } finally {
      setLoading(false);
    }
  };

  const submitRecovery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();
    setLoading(true);
    try {
      const response = await apiRequest<null>("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      showNotice(response.message);
      setStep("password");
    } catch (caught) {
      handleError(caught);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    clearErrors();
    setLoading(true);
    try {
      const response = await apiRequest<null>("/api/v1/auth/email/verification-notification", { method: "POST" });
      showNotice(response.message);
    } catch (caught) {
      handleError(caught);
    } finally {
      setLoading(false);
    }
  };

  const returnToEmail = () => {
    clearErrors();
    setStep("email");
  };

  const generatedPassword = () => {
    const groups = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz", "23456789", "!@#$%&*?_"];
    const all = groups.join("");
    const bytes = crypto.getRandomValues(new Uint32Array(16));
    const required = groups.map((group, index) => group[bytes[index] % group.length]);
    const rest = Array.from(bytes.slice(4), (value) => all[value % all.length]);
    const characters = [...required, ...rest];
    for (let index = characters.length - 1; index > 0; index -= 1) {
      const target = bytes[index % bytes.length] % (index + 1);
      [characters[index], characters[target]] = [characters[target], characters[index]];
    }
    const safePassword = characters.join("");
    setPassword(safePassword);
    setPasswordConfirmation(safePassword);
    setShowPassword(true);
    showNotice("Senha segura gerada. Guarde-a em um gerenciador de senhas.");
  };

  const strength = passwordStrength(password);

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
            <ul><li><b>01</b> Histórico de análises e explicações</li><li><b>02</b> Curadorias, favoritos e pedidos</li><li><b>03</b> Consentimentos e dados sob controle</li></ul>
          </figcaption>
        </figure>

        <section className={styles.formColumn}>
          <div className={styles.card}>
            <div className={styles.progress} aria-label="Progresso do acesso">
              <i className={styles.active} /><i className={step !== "email" ? styles.active : ""} /><i className={step === "verify" || step === "success" ? styles.active : ""} /><span>Acesso seguro</span>
            </div>

            {step === "email" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Entrar ou criar conta</p><h1 id="auth-title">Comece pelo seu e-mail.</h1><p>Informe seu e-mail para acessar sua conta ou iniciar um cadastro.</p>
              <form onSubmit={continueWithEmail} noValidate><Field label="E-mail" htmlFor="auth-email" error={error}><input id="auth-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" /></Field><SubmitButton loading={loading}>Continuar</SubmitButton></form>
              <div className={styles.separator}>ou</div>
              <button className={styles.social} type="button" onClick={() => showNotice("Google ainda precisa das credenciais OAuth do provedor.")}><span>G</span> Continuar com Google</button>
              <button className={styles.social} type="button" onClick={() => showNotice("Apple ainda precisa das credenciais OAuth do provedor.")}><span>●</span> Continuar com Apple</button>
            </div> : null}

            {step === "password" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Acessar conta</p><h1 id="auth-title">Que bom ter você de volta.</h1><p>Entrando como <strong>{email}</strong>. <button type="button" className={styles.textButton} onClick={returnToEmail}>Trocar e-mail</button></p>
              <form onSubmit={submitPassword} noValidate><Field label="Senha" htmlFor="auth-password" error={fieldErrors.password?.[0] ?? error}><div className={styles.passwordField}><input id="auth-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Ocultar" : "Mostrar"}</button></div></Field><div className={styles.formOptions}><label><input name="remember" type="checkbox" /> Manter conectado</label><button type="button" className={styles.textButton} onClick={() => { clearErrors(); setStep("recovery"); }}>Esqueci a senha</button></div><SubmitButton loading={loading}>Entrar</SubmitButton></form>
              <button className={styles.secondary} type="button" onClick={() => { clearErrors(); setStep("register"); }}>Ainda não tenho conta</button>
            </div> : null}

            {step === "register" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Nova conta</p><h1 id="auth-title">Crie seu acesso.</h1><p>A senha precisa ter 12 caracteres, maiúscula, minúscula, número e símbolo.</p>
              <form onSubmit={submitRegistration} noValidate>
                <Field label="Como podemos chamar você?" htmlFor="register-name" error={fieldErrors.name?.[0]}><input id="register-name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></Field>
                <Field label="E-mail" htmlFor="register-email" error={fieldErrors.email?.[0]}><input id="register-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
                <Field label="Crie uma senha" htmlFor="register-password" error={fieldErrors.password?.[0]}><div className={styles.passwordField}><input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Ocultar" : "Mostrar"}</button></div></Field>
                <PasswordStrength password={password} level={strength.level} suggestions={strength.suggestions} />
                <button className={extra.generatePassword} type="button" onClick={generatedPassword}>Gerar senha segura</button>
                <Field label="Confirme a senha" htmlFor="register-password-confirmation"><input id="register-password-confirmation" name="password_confirmation" type={showPassword ? "text" : "password"} autoComplete="new-password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} /></Field>
                <label className={styles.legal}><input name="terms" type="checkbox" /> <span>Li os <Link href="/privacidade">Termos e a Política de Privacidade</Link>. Marketing é opcional e será solicitado separadamente.</span></label>
                {error ? <p className={extra.formError} role="alert">{error}</p> : null}
                <SubmitButton loading={loading}>Criar conta</SubmitButton>
              </form>
              <button className={styles.textButton} type="button" onClick={() => setStep("password")}>Já tenho uma conta</button>
            </div> : null}

            {step === "verify" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Confirmar e-mail</p><h1 id="auth-title">Confira sua caixa de entrada.</h1><p>Enviamos um link de confirmação para <strong>{user?.email ?? email}</strong>. Abra o link no mesmo navegador para validar sua conta.</p>
              {error ? <p className={extra.formError} role="alert">{error}</p> : null}
              <SubmitButton loading={loading} type="button" onClick={() => void resendVerification()}>Reenviar link</SubmitButton>
              <Link href="/produtos" className={styles.secondaryLink}>Continuar navegando</Link>
            </div> : null}

            {step === "recovery" ? <div className={styles.pane}>
              <p className={styles.eyebrow}>Recuperar acesso</p><h1 id="auth-title">Vamos ajudar você a voltar.</h1><p>Por segurança, a resposta será a mesma exista ou não uma conta para o e-mail informado.</p>
              <form onSubmit={submitRecovery} noValidate><Field label="E-mail da conta" htmlFor="recovery-email" error={fieldErrors.email?.[0] ?? error}><input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field><SubmitButton loading={loading}>Enviar instruções</SubmitButton></form>
              <button className={styles.secondary} type="button" onClick={() => setStep("password")}>Voltar para entrar</button>
            </div> : null}

            {step === "success" ? <div className={styles.pane}>
              <span className={styles.successMark} aria-hidden="true">✓</span><p className={styles.eyebrow}>Acesso concluído</p><h1 id="auth-title">Tudo pronto, {user?.name ?? name ?? "bem-vinda"}.</h1><p>Sua sessão está protegida e persistida pelo backend. Você pode continuar pela jornada do MVP.</p><Link href="/analise" className={styles.primaryLink}>Começar análise</Link><Link href="/produtos" className={styles.secondaryLink}>Explorar produtos</Link>
            </div> : null}

            <aside className={styles.integrationNote}>Sessão protegida por cookie HttpOnly, CSRF e limites de tentativas. A D’Accord nunca envia sua senha por e-mail.</aside>
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

function SubmitButton({ loading, children, ...props }: { loading: boolean; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${styles.primary} ${loading ? extra.loading : ""}`} disabled={loading} type="submit" {...props}>{loading ? "Aguarde…" : children}</button>;
}

function PasswordStrength({ password, level, suggestions }: { password: string; level: "fraca" | "média" | "forte"; suggestions: string[] }) {
  if (!password) return null;
  return <div className={extra.passwordStrength} data-level={level}><div><span /><span /><span /></div><p>Força: <b>{level}</b></p>{suggestions.length ? <ul>{suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul> : <small>Boa escolha. Evite reutilizar esta senha em outros serviços.</small>}</div>;
}

function passwordStrength(password: string) {
  const checks = [password.length >= 12, /[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)];
  const score = checks.filter(Boolean).length;
  const suggestions = [
    !checks[0] && "Use pelo menos 12 caracteres.",
    (!checks[1] || !checks[2]) && "Misture letras maiúsculas e minúsculas.",
    !checks[3] && "Adicione pelo menos um número.",
    !checks[4] && "Adicione pelo menos um símbolo.",
  ].filter((item): item is string => Boolean(item));
  return { level: score === 5 ? "forte" as const : score >= 3 ? "média" as const : "fraca" as const, suggestions };
}
