/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, Paperclip } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { COLORS } from "../../../constants/colors";
import { apiRequest } from "@/services";
import { useAuth } from "@/context";
import {
  NEW_COMMENTS,
  SHOW_ALL_SPECIFIC_COMMENT,
} from "../../../../api/api-variable";

interface CommentItem {
  id: number | string;
  message: string;
  attachment: string | null;
  user_type: string; // 'User' | 'Admin' etc.
  user_name?: string;
  created_at?: string | null | undefined;
}

interface TicketPayload {
  id?: number | string;
  subject?: string;
  department?: string;
  priority?: string;
  status?: string;
  created_on?: string;
  comments?: CommentItem[];
}

interface ChatInterfaceProps {
  ticket?: TicketPayload | null;
  onSend?: (
    message: string,
    attachmentFile?: File | null 
  ) => Promise<void> | void;
  className?: string;
}

const isImageUrl = (url: string) => {
  return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url);
};

const formatDateTime = (input?: string) => {
  if (!input) return "";
  try {
    const d = new Date(input);
    return d.toLocaleString();
  } catch (error) {
    console.log("Date parse error:", error);
    return input;
  }
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ ticket }) => {
  const { token } = useAuth();

  const [messageText, setMessageText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // const [sending, setSending] = useState(false);
  
  const [messages, setMessages] = useState<CommentItem[]>(() =>
    ticket?.comments ? [...ticket.comments] : []
  );
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(ticket?.comments ? [...ticket.comments] : []);
  }, [ticket?.comments]);

  useEffect(() => {
    // scroll to bottom when messages change
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages.length]);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  };
  const fetchAllComments = () => {
    apiRequest({
      endpoint: `${SHOW_ALL_SPECIFIC_COMMENT}/${ticket?.id}`,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response: any) => {
        console.log("Messages:", response);
        setMessages(response.ticket?.comments || []);
      })
      .catch((error: any) => {
        console.error("Failed to fetch messages:", error);
      });
  };
  useEffect(() => {
    fetchAllComments();
  }, [ticket?.id]);
  const handleSend = async () => {
    if (!messageText.trim() && !file) return;
    const formdata = new FormData();
    formdata.append("message", messageText);
    formdata.append("attachment", file || "");
    apiRequest({
      endpoint: `${NEW_COMMENTS}/${ticket?.id}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formdata,
    })
      .then((response: any) => {
        console.log("Messages:", response);
        if (response.response === true) {
          setMessages(response.ticket?.comments || []);
          setMessageText("");
          setFile(null);
          fetchAllComments()
        }
      })
      .catch((error: any) => {
        console.error("Failed to fetch messages:", error);
      });
  };

  return (
    <div>
      <Card className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className={`font-semibold text-${COLORS.SECONDARY}`}>
              {ticket?.subject || "Support Ticket"}
            </h3>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
              #{ticket?.id} • {ticket?.department} •{" "}
              <span className="font-medium">{ticket?.priority}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Created: {formatDateTime(ticket?.created_on)}
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <div className="text-sm text-green-600">Support Team</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Status: {ticket?.status || "Open"}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="mx-auto mb-2" />
              No messages yet
            </div>
          ) : (
            messages.map((m) => {
              const isUser = (m.user_type || "").toLowerCase() === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {m.message}
                    </div>
                    {m.attachment && (
                      <div className="mt-2">
                        {isImageUrl(m.attachment) ? (
                          // show image preview
                          <a
                            href={m.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={m.attachment}
                              alt="attachment"
                              className="w-48 h-auto rounded-md border"
                            />
                          </a>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-xs ${
                          isUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {m.user_name || (isUser ? "You" : "Support")}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDateTime(m.created_at ?? undefined)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-600">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                onChange={handleSelectFile}
              />
              <span className="hidden sm:inline">Attach</span>
              {file && (
                <span className="ml-2 text-xs text-gray-500">{file.name}</span>
              )}
            </label>

            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <Button
              onClick={handleSend}
              // disabled={sending}
              className="px-3 py-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
