export type HelpRequest = {
  message?: string;
};

export type HelpResponse = {
  channel: "daccord-assistant";
  reply: string;
  suggestions: string[];
};

export type ApiStatus = {
  status: "ok" | "planned";
  service: string;
  timestamp?: string;
};
