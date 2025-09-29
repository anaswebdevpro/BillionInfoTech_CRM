export interface CommentItem {
  id: number | string;
  message: string;
  attachment: string | null;
  user_type: string; // 'User' | 'Admin' etc.
  user_name?: string;
  created_on?: string | null | undefined;
}

export interface TicketPayload {
  id?: number | string;
  subject?: string;
  department?: string;
  priority?: string;
  status?: string;
  created_on?: string;
  comments?: CommentItem[];
}

export interface ChatInterfaceProps {
  ticket?: TicketPayload | null;
  onSend?: (
    message: string,
    attachmentFile?: File | null 
  ) => Promise<void> | void;
  className?: string;
}
