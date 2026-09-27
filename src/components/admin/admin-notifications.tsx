"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { adminNotificationsApi, type AdminNotification } from "@/lib/admin-notifications";
import styles from "./admin-notifications.module.css";

export function AdminNotifications() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    setError("");
    try {
      const response = await adminNotificationsApi.list(page);
      setNotifications((current) => append ? [...current, ...response.data.notifications.data] : response.data.notifications.data);
      setUnreadCount(response.data.unread_count);
      setHasMore(Boolean(response.data.notifications.next_page_url));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Não foi possível consultar as notificações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadNotifications(), 0);
    return () => window.clearTimeout(timer);
  }, [loadNotifications]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const markAsRead = async (notification: AdminNotification) => {
    if (notification.read_at) return;
    setSavingId(notification.id);
    setError("");
    try {
      const response = await adminNotificationsApi.markAsRead(notification.id);
      setNotifications((current) => current.map((item) => item.id === notification.id ? response.data.notification : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Não foi possível marcar a notificação como lida.");
    } finally {
      setSavingId(null);
    }
  };

  const openNotification = async (notification: AdminNotification) => {
    if (!notification.read_at) {
      setSavingId(notification.id);
      setError("");
      try {
        const response = await adminNotificationsApi.markAsRead(notification.id);
        setNotifications((current) => current.map((item) => item.id === notification.id ? response.data.notification : item));
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch (caught) {
        setError(caught instanceof ApiError ? caught.message : "Não foi possível marcar a notificação como lida.");
        setSavingId(null);
        return;
      }
      setSavingId(null);
    }
    setOpen(false);
    router.push(notification.target_url);
  };

  const markAllAsRead = async () => {
    setSavingAll(true);
    setError("");
    try {
      await adminNotificationsApi.markAllAsRead();
      const readAt = new Date().toISOString();
      setNotifications((current) => current.map((item) => ({ ...item, read_at: item.read_at ?? readAt })));
      setUnreadCount(0);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Não foi possível marcar as notificações como lidas.");
    } finally {
      setSavingAll(false);
    }
  };

  return <div className={styles.root} ref={rootRef}>
    <button
      ref={triggerRef}
      className={styles.trigger}
      type="button"
      aria-label={unreadCount ? `Notificações, ${unreadCount} não lidas` : "Notificações"}
      aria-expanded={open}
      aria-controls="admin-notifications-panel"
      onClick={() => {
        const nextOpen = !open;
        setOpen(nextOpen);
        if (nextOpen) void loadNotifications();
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
      {unreadCount > 0 ? <span className={styles.badge} aria-hidden="true">{unreadCount > 99 ? "99+" : unreadCount}</span> : null}
    </button>

    {open ? <section className={styles.panel} id="admin-notifications-panel" aria-label="Notificações administrativas" aria-busy={loading}>
      <header className={styles.panelHeader}>
        <h2>Notificações</h2>
        <button type="button" onClick={() => void markAllAsRead()} disabled={unreadCount === 0 || savingAll}>
          {savingAll ? "Salvando…" : "Marcar todas como lidas"}
        </button>
      </header>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {loading && notifications.length === 0 ? <p className={styles.message}>Carregando notificações…</p> : null}
      {!loading && notifications.length === 0 && !error ? <p className={styles.message}>Nenhuma notificação no momento.</p> : null}
      {notifications.length > 0 ? <div className={styles.list}>
        {notifications.map((notification) => <article className={`${styles.item} ${notification.read_at ? styles.read : styles.unread}`} key={notification.id}>
          <div className={styles.itemHeading}>
            <span>{notification.resolved_at ? `Resolvido · ${getTypeLabel(notification)}` : getTypeLabel(notification)}</span>
            {!notification.read_at ? <i aria-label="Não lida" /> : null}
          </div>
          <button className={styles.itemLink} type="button" onClick={() => void openNotification(notification)} disabled={savingId === notification.id}>
            <strong>{notification.title}</strong>
            <span>{notification.summary}</span>
          </button>
          <div className={styles.itemFooter}>
            <time dateTime={notification.created_at}>{formatDate(notification.created_at)}</time>
            {!notification.read_at ? <button type="button" onClick={() => void markAsRead(notification)} disabled={savingId === notification.id} aria-label={`Marcar como lida: ${notification.title}`}>Marcar como lida</button> : null}
          </div>
        </article>)}
        {hasMore ? <button className={styles.loadMore} type="button" onClick={() => void loadNotifications(Math.ceil(notifications.length / 8) + 1, true)} disabled={loading}>Carregar mais</button> : null}
      </div> : null}
    </section> : null}
  </div>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function getTypeLabel(notification: AdminNotification) {
  return notification.type === "low_stock" ? "Estoque baixo" : "Operacional";
}