export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const CONFIGURED_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
let csrfReady = false;

export function apiBaseUrl() {
  return typeof window === "undefined" ? CONFIGURED_API_URL : "/backend";
}

function requestUrl(path: string) {
  if (!/^https?:\/\//.test(path)) return `${apiBaseUrl()}${path}`;
  if (typeof window === "undefined") return path;

  const target = new URL(path);
  const configured = new URL(CONFIGURED_API_URL);
  return target.origin === configured.origin
    ? `/backend${target.pathname}${target.search}`
    : path;
}

function cookie(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.split("; ").find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

async function initializeCsrf() {
  if (csrfReady) return;
  const response = await fetch(`${apiBaseUrl()}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new ApiError("Não foi possível iniciar a sessão segura.", response.status);
  csrfReady = true;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, retry = true): Promise<ApiEnvelope<T>> {
  const method = (init.method ?? "GET").toUpperCase();
  const mutating = !["GET", "HEAD", "OPTIONS"].includes(method);
  if (mutating) await initializeCsrf();

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const xsrfToken = cookie("XSRF-TOKEN");
  if (mutating && xsrfToken) headers.set("X-XSRF-TOKEN", xsrfToken);

  const url = requestUrl(path);
  const response = await fetch(url, { ...init, credentials: "include", headers });

  if (response.status === 419 && retry) {
    csrfReady = false;
    return apiRequest<T>(path, init, false);
  }

  const payload = await response.json().catch(() => ({
    success: false,
    message: "O servidor retornou uma resposta inesperada.",
    errors: {},
  }));

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("daccord:session-expired"));
    }
    throw new ApiError(payload.message ?? "Não foi possível concluir a solicitação.", response.status, payload.errors ?? {});
  }

  return payload as ApiEnvelope<T>;
}

export function resetCsrfState() {
  csrfReady = false;
}
