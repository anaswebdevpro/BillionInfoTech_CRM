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
  created_on?: string | null | undefined;
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

// Helper function to format date for separators
const formatDateForSeparator = (dateString: string) => {
  try {
    // Handle empty or invalid date strings
    if (!dateString || dateString.trim() === '') {
      return "Today";
    }
    
    const messageDate = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(messageDate.getTime())) {
      console.log("Invalid date string:", dateString);
      return "Today";
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time to compare only dates
    const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (messageDateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  } catch (error) {
    console.log("Date separator error:", error, "for date:", dateString);
    return "Today";
  }
};

// Helper function to group messages by date
const groupMessagesByDate = (messages: CommentItem[]) => {
  const grouped: { [key: string]: CommentItem[] } = {};
  
  messages.forEach(message => {
    // Use created_on if available, otherwise use current date for optimistic messages
    let dateString = message.created_on || new Date().toISOString();
    
    // Handle invalid dates
    const testDate = new Date(dateString);
    if (isNaN(testDate.getTime())) {
      console.log("Invalid date in message:", message.created_on, "using current date");
      dateString = new Date().toISOString();
    }
    
    const dateKey = new Date(dateString).toDateString();
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });
  
  return grouped;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ ticket }) => {
  const { token } = useAuth();

  const [messageText, setMessageText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  
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
  const handleSend = () => {
    if (!messageText.trim() && !file) return;
    
    setSending(true);
    
    // Create optimistic message
    const optimisticMessage: CommentItem = {
      id: `temp-${Date.now()}`, // Temporary ID
      message: messageText,
      attachment: file ? file.name : null,
      user_type: "User",
      user_name: "You",
      created_on: new Date().toISOString(),
    };
    
    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Clear input immediately for better UX
    const currentMessage = messageText;
    const currentFile = file;
    setMessageText("");
    setFile(null);
    
    const formdata = new FormData();
    formdata.append("message", currentMessage);
    formdata.append("attachment", currentFile || "");
    
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
        console.log("Send response:", response);
        
        if (response?.response === true) {
          // Check if server response contains our message
          const serverMessages = response?.ticket?.comments || [];
          const hasNewMessage = serverMessages.some((msg: any) => 
            msg.message === currentMessage && 
            msg.user_type?.toLowerCase() === 'user'
          );
          
          if (hasNewMessage) {
            // Server has our message, replace optimistic with real data
            setMessages(serverMessages);
          } else {
            // Server doesn't have our message yet, keep optimistic and fetch
            setTimeout(() => {
              setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
              fetchAllComments();
            }, 1000); // Wait 1 second then fetch
          }
        } else {
          // If send failed, remove the optimistic message
          setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
          // Restore the message text
          setMessageText(currentMessage);
          setFile(currentFile);
          console.error("Failed to send message");
        }
      })
      .catch((error: any) => {
        console.error("Failed to send message:", error);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        // Restore the message text
        setMessageText(currentMessage);
        setFile(currentFile);
      })
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <div>
      <Card className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-${COLORS.BORDER}`}>
          <div>
            <h3 className={`font-semibold text-${COLORS.SECONDARY}`}>
              {ticket?.subject || "Support Ticket"}
            </h3>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
              #{ticket?.id} • {ticket?.department} •{" "}
              <span className="font-medium">{ticket?.priority}</span>
            </div>
            <div className={`text-xs text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Created: {formatDateTime(ticket?.created_on)}
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2">
              <div className={`w-2 h-2 bg-${COLORS.PRIMARY} rounded-full`} />
              <div className={`text-sm text-${COLORS.PRIMARY}`}>Support Team</div>
            </div>
            <div className={`text-xs text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Status: {ticket?.status || "Open"}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className={`text-center py-8 text-${COLORS.SECONDARY_TEXT}`}>
              <MessageCircle className="mx-auto mb-2" />
              No messages yet
            </div>
          ) : (
            (() => {
              const groupedMessages = groupMessagesByDate(messages);
              const sortedDates = Object.keys(groupedMessages).sort((a, b) => 
                new Date(a).getTime() - new Date(b).getTime()
              );
              
              return sortedDates.map(dateKey => {
                const dayMessages = groupedMessages[dateKey];
                const firstMessage = dayMessages[0];
                
                return (
                  <div key={dateKey}>
                    {/* Date Separator */}
                    <div className="flex items-center justify-center my-4">
                      <div className={`bg-${COLORS.GRAY_LIGHT} text-${COLORS.SECONDARY_TEXT} text-xs px-3 py-1 rounded-full`}>
                        {formatDateForSeparator(firstMessage.created_on || '')}
                      </div>
                    </div>
                    
                    {/* Messages for this date */}
                    {dayMessages.map((m) => {
                      const isUser = (m.user_type || "").toLowerCase() === "user";
                      const isOptimistic = typeof m.id === 'string' && m.id.startsWith('temp-');
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-2`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isUser
                                ? `bg-gradient-to-t from-green-100 to-green-200 text-${COLORS.BLACK}  `
                                : `bg-${COLORS.SECONDARY_BG} text-${COLORS.SECONDARY}`
                            } ${isOptimistic ? "opacity-70" : ""}`}
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
                                  isUser ? `text-${COLORS.PRIMARY_BG_LIGHT}` : `text-${COLORS.SECONDARY_TEXT}`
                                }`}
                              >
                                {m.user_name || (isUser ? "" : "Support")}
                                {isOptimistic && " (Sending...)"}
                              </span>
                            </div>
                          </div>
                          <span className={`text-xs text-${COLORS.GRAY} mt-1 ${isUser ? "text-right" : "text-left"}`}>
                            {formatDateTime(m.created_on ?? undefined)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })()
          )}
        </div>

        {/* Input area */}
        <div className={`p-4 border-t border-${COLORS.BORDER}`}>
          <div className="flex items-center gap-2">
            <label className={`cursor-pointer inline-flex items-center gap-2 text-sm text-${COLORS.SECONDARY_TEXT}`}>
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                onChange={handleSelectFile}
              />
              <span className="hidden sm:inline">Attach</span>
              {file && (
                <span className={`ml-2 text-xs text-${COLORS.SECONDARY_TEXT}`}>{file.name}</span>
              )}
            </label>

            <input
              type="text"
              placeholder="Type your message..."
              className={`flex-1 px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY}`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <Button
              onClick={handleSend}
              disabled={sending || (!messageText.trim() && !file)}
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
