import { apiRequest } from "@/lib/api-client";
import type { Pagination } from "@/types/catalog";

export type AdminNotification = {
  id: number;
  type: string;
  title: string;
  summary: string;
  target_url: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  resolved_at: string | null;
  created_at: string;
};

export type AdminNotificationList = {
  notifications: Pagination<AdminNotification>;
  unread_count: number;
};

export const adminNotificationsApi = {
  list: (page = 1) => apiRequest<AdminNotificationList>(`/api/v1/admin/notifications?per_page=8&page=${page}`),
  markAsRead: (id: number) => apiRequest<{ notification: AdminNotification }>(`/api/v1/admin/notifications/${id}/read`, {
    method: "PATCH",
  }),
  markAllAsRead: () => apiRequest<null>("/api/v1/admin/notifications/read-all", {
    method: "PATCH",
  }),
};