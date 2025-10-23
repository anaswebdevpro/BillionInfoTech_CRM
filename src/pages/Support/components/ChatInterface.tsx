/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, MessageCircle, X } from "lucide-react";
import { Card } from "@/components";
import { COLORS } from "@/constants/colors";
import { apiRequest } from "@/services";
import { NEW_COMMENTS } from "../../../../api/api-variable";
import { useAuth } from "@/context";
import bgImage from "../../../assets/chatwallpapper.jpg";

// ==================== TYPES ====================
interface Message {
  id: number | string;
  message: string;
  attachment: string | null;
  user_type: string;
  user_name?: string;
  created_on?: string | null | undefined;
  isOptimistic?: boolean;
  tempId?: string;
}

interface TicketPayload {
  id?: number | string;
  subject?: string;
  department?: string;
  priority?: string;
  status?: string;
  created_on?: string;
  comments?: Message[];
}

interface ChatInterfaceProps {
  ticket?: TicketPayload | null;
  onMessageSent?: () => void;
}

// ==================== UTILITY FUNCTIONS ====================
// Check if attachment exists and is valid
const hasValidAttachment = (attachment: string | null | undefined): boolean => {
  if (!attachment) return false;
  if (attachment === "") return false;
  if (attachment === "null") return false;
  if (attachment === "undefined") return false;
  if (attachment.trim() === "") return false;

  // Check if it's just the base domain without an actual file path
  // if (attachment === "https://amf.billioninfotech.com/") return false;
  // if (attachment === "https://amf.billioninfotech.com") return false;
  if (attachment === "http://amf.billioninfotech.com/") return false;
  // if (attachment === "http://amf.billioninfotech.com") return false;

  // Check if URL ends with just a slash (no file)
  const url = attachment.trim();
  if (url.endsWith("/") && url.split("/").filter(Boolean).length <= 2)
    return false;

  return true;
};

// Get full attachment URL
const getAttachmentUrl = (attachment: string | null) => {
  if (!attachment) return "";

  // If already a full URL, return as is
  if (attachment.startsWith("http://") || attachment.startsWith("https://")) {
    return attachment;
  }

  // Otherwise, construct full URL (base domain without /api/v1)
  return `https://amf.billioninfotech.com/${attachment}`;
};

// Check if URL is an image
const isImageUrl = (url: string) => {
  return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url);
};

// Format date and time for display
const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    // Always show only time
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Date format error:", error);
    return "";
  }
};

// Format date for separator (Today, Yesterday, or full date)
const formatDateForSeparator = (dateString: string | null | undefined) => {
  try {
    if (!dateString || dateString.trim() === "") return "Today";

    const messageDate = new Date(dateString);
    if (isNaN(messageDate.getTime())) return "Today";

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    const messageDateOnly = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (messageDateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  } catch (error) {
    console.error("Date separator error:", error);
    return "Today";
  }
};

// Group messages by date
const groupMessagesByDate = (messages: Message[]) => {
  const grouped: { [key: string]: Message[] } = {};

  messages.forEach((message) => {
    let dateString = message.created_on || new Date().toISOString();

    const testDate = new Date(dateString);
    if (isNaN(testDate.getTime())) {
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

// Limit text for read more functionality
const limitText = (text: string, limit: number) => {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + "...";
};

// ==================== MAIN COMPONENT ====================
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  ticket,
  onMessageSent,
}) => {
  const { token } = useAuth();

  // State management
  const [messageText, setMessageText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(
    new Set()
  );
  const [hasLocalUpdate, setHasLocalUpdate] = useState(false);

  // Refs
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local messages when prop changes (only if not sending)
  useEffect(() => {
    if (!hasLocalUpdate) {
      setLocalMessages(ticket?.comments || []);
    } else {
      // Only update if the new messages array is longer (means new message arrived)
      if (ticket?.comments && ticket.comments.length > localMessages.length) {
        setLocalMessages(ticket.comments);
        setHasLocalUpdate(false);
      }
    }
  }, [ticket?.comments, hasLocalUpdate, localMessages.length]);

  // Reset local update flag when ticket changes
  useEffect(() => {
    setHasLocalUpdate(false);
    setExpandedMessages(new Set()); // Reset expanded messages when switching tickets
  }, [ticket?.id]);

  // Auto-scroll to bottom when messages change - smooth behavior
  useEffect(() => {
    if (!scrollerRef.current) return;

    // Use smooth scroll behavior
    scrollerRef.current.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [localMessages.length]);

  // Handle file selection
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  // Handle send message
  const handleSend = () => {
    if (!messageText.trim() && !file) return;
    if (!ticket?.id) {
      console.error("No ticket selected");
      return;
    }

    setSending(true);
    setHasLocalUpdate(true); // Prevent prop updates from overwriting

    // Store current message text and file for the optimistic message
    const currentMessage = messageText;
    const currentFile = file;

    // Create optimistic message with unique temporary ID
    const optimisticMessage: any = {
      id: `temp-${Date.now()}`,
      message: currentMessage,
      attachment: currentFile ? currentFile.name : null,
      user_type: "User",
      user_name: "You",
      created_on: new Date().toISOString(),
      isOptimistic: true,
      tempId: `temp-${Date.now()}`, // Unique ID for tracking
    };

    // Add optimistic message immediately
    setLocalMessages((prev) => [...prev, optimisticMessage]);

    // Clear input immediately for better UX
    setMessageText("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Refocus input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    // Prepare form data
    const formdata = new FormData();
    formdata.append("message", currentMessage);
    formdata.append("attachment", currentFile || "");

    // API call to send message
    apiRequest({
      endpoint: `${NEW_COMMENTS}/${ticket.id}`,
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
          // Check if response contains the new message data
          const serverMessages = response?.ticket?.comments || [];

          if (serverMessages.length > 0) {
            // Smoothly replace optimistic message with server data
            console.log("Updating local messages with server data");
            setLocalMessages(serverMessages);
            setHasLocalUpdate(false);
          } else {
            // API doesn't return comments, so we need to refresh from parent
            console.log("No comments in response, fetching from parent");

            // Convert optimistic message to confirmed state temporarily
            setLocalMessages((prev) =>
              prev.map((msg) =>
                msg.tempId === optimisticMessage.tempId
                  ? { ...msg, isOptimistic: false }
                  : msg
              )
            );

            // Trigger parent to fetch updated messages
            if (onMessageSent) {
              onMessageSent();
            }

            // Allow parent messages to sync after parent fetch completes
            setTimeout(() => {
              setHasLocalUpdate(false);
            }, 1500);
          }
        } else {
          // Remove optimistic message on failure
          console.log("Send failed, removing optimistic message");
          setLocalMessages((prev) =>
            prev.filter((msg) => msg.tempId !== optimisticMessage.tempId)
          );
          setHasLocalUpdate(false);
          console.error("Failed to send message");
        }
      })
      .catch((error: any) => {
        console.error("Failed to send message:", error);
        // Remove optimistic message on error
        setLocalMessages((prev) =>
          prev.filter((msg) => msg.tempId !== optimisticMessage.tempId)
        );
        setHasLocalUpdate(false);
      })
      .finally(() => {
        setSending(false);
      });
  };

  // Toggle read more/less
  const toggleExpanded = (index: number) => {
    setExpandedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(localMessages);
  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="bg-white max-w-full">
      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <Card className="flex flex-col h-full">
        {/* ==================== HEADER ==================== */}
        <div
          className={`flex items-center justify-between p-4 border-b border-${COLORS.BORDER}`}
        >
          <div>
            <h3 className={`font-semibold text-${COLORS.SECONDARY}`}>
              {ticket?.subject || "Support Ticket"}
            </h3>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
              #{ticket?.id} • {ticket?.department} •{" "}
              <span className="font-medium">{ticket?.priority}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="inline-flex items-center gap-2">
                <div
                  className={`w-2 h-2 ${
                    ticket?.status?.toLowerCase() === "open"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  } rounded-full`}
                />
                <div
                  className={`text-sm ${
                    ticket?.status?.toLowerCase() === "open"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {ticket?.status || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== MESSAGES LIST ==================== */}
        <div
          ref={scrollerRef}
          className={`flex-1 p-4 space-y-4 overflow-y-scroll max-h-[calc(100vh-400px)]`}
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            scrollBehavior: "smooth",
          }}
        >
          {localMessages.length === 0 ? (
            <div
              className={`text-center py-8 text-${COLORS.SECONDARY_TEXT} bg-white/80 rounded-lg`}
            >
              <MessageCircle className="mx-auto mb-2 h-12 w-12 text-gray-400" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation below</p>
            </div>
          ) : (
            sortedDates.map((dateKey) => {
              const dayMessages = groupedMessages[dateKey];
              const firstMessage = dayMessages[0];

              return (
                <div key={dateKey}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-4">
                    <div
                      className={`bg-gray-200 text-${COLORS.SECONDARY_TEXT} text-xs px-3 py-1 rounded-full`}
                    >
                      {formatDateForSeparator(firstMessage.created_on || "")}
                    </div>
                  </div>

                  {/* Messages for this date */}
                  {dayMessages.map((message, index) => {
                    const isUser = message.user_type?.toLowerCase() === "user";
                    const isOptimistic = (message as any).isOptimistic;
                    const messageIndex = localMessages.indexOf(message);
                    const isExpanded = expandedMessages.has(messageIndex);
                    const shouldTruncate = message.message.length > 150;

                    return (
                      <div
                        key={message.tempId || `${message.created_on}-${index}`}
                        className={`flex flex-col ${
                          isUser ? "items-end" : "items-start"
                        } mb-2`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg smooth-transition ${
                            isUser
                              ? `bg-gradient-to-t from-green-100 to-green-200 text-${COLORS.BLACK}`
                              : `bg-white text-${COLORS.SECONDARY} shadow-sm`
                          } ${isOptimistic ? "opacity-70" : "opacity-100"}`}
                        >
                          {/* Attachment First */}
                          {hasValidAttachment(message.attachment) && (
                            <div className="mb-2">
                              {isImageUrl(message.attachment!) ? (
                                <a
                                  href={getAttachmentUrl(message.attachment)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={getAttachmentUrl(message.attachment)}
                                    alt="attachment"
                                    className="w-48 h-auto rounded-md border"
                                  />
                                </a>
                              ) : (
                                <a
                                  href={getAttachmentUrl(message.attachment)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 text-xs underline"
                                >
                                  View Attachment
                                </a>
                              )}
                            </div>
                          )}

                          {/* Message Text */}
                          <div className="whitespace-pre-wrap text-sm">
                            {shouldTruncate && !isExpanded
                              ? limitText(message.message, 150)
                              : message.message}
                            {shouldTruncate && (
                              <button
                                onClick={() => toggleExpanded(messageIndex)}
                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
                              >
                                {isExpanded ? "Show less" : "Read more"}
                              </button>
                            )}
                          </div>

                          {isOptimistic && (
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-green-700">
                                (Sending...)
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 font-medium">
                            {isUser
                              ? "You"
                              : message.user_name || message.user_type}
                          </span>
                          <span
                            className={`text-xs text-gray-500 ${
                              isUser ? "text-right" : "text-left"
                            }`}
                          >
                            {formatDateTime(message.created_on)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* ==================== MESSAGE INPUT ==================== */}
        <div className={`p-4 border-t border-${COLORS.BORDER}`}>
          {/* File Preview */}
          {file && (
            <div className="mb-2 flex items-center gap-2 text-sm bg-gray-100 p-2 rounded">
              <Paperclip className="w-4 h-4" />
              <span className="flex-1 truncate">{file.name}</span>
              <button
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label
              className={`cursor-pointer inline-flex items-center gap-2 text-sm text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY} transition-colors`}
            >
              <Paperclip className="w-5 h-5" />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleSelectFile}
                accept="image/*,.pdf,.doc,.docx"
              />
            </label>

            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className={`flex-1 px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY}`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              disabled={sending || (!messageText.trim() && !file)}
              className={`px-4 py-2 bg-${COLORS.PRIMARY} text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              <Send className="w-4 h-4" />
              <span>{sending ? "Sending..." : "Send"}</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
