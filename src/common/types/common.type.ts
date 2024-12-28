export type MessageStatus = "READ" | "DELIVERED" | "SENT";

export type Inbox = {
  id: string;
  name: string;
  image: string;
  lastMessage?: string;
  timestamp?: string;
  messageStatus?: MessageStatus;
  notificationsCount?: number;
  isPinned?: boolean;
  isOnline?: boolean;
  isRobot?: boolean;

};

export type Message = {
  id: string;
  body: string;
  date: string;
  timestamp: string;
  messageStatus: MessageStatus;
  isOpponent: boolean;
};
