
import { type ReactNode } from "react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  gradient: string;
}

export interface ConversationHistory {
  id: string;
  title: string;
  date: Date;
  assistantId: string;
  preview: string;
}
