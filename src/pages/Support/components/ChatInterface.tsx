/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import { apiRequest } from "@/services";
import { useAuth } from "@/context";
import {
  NEW_COMMENTS,
  SHOW_ALL_SPECIFIC_COMMENT,
} from "../../../../api/api-variable";
import { CommentItem, ChatInterfaceProps } from "./types";
import { ChatHeader, MessageList, MessageInput } from "./index";

const ChatInterface: React.FC<ChatInterfaceProps> = ({ ticket }) => {
  const { token } = useAuth();

  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<CommentItem[]>(() =>
    ticket?.comments ? [...ticket.comments] : []
  );

  useEffect(() => {
    setMessages(ticket?.comments ? [...ticket.comments] : []);
  }, [ticket?.comments]);

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

  const handleSend = (messageText: string, file: File | null) => {
    if (!messageText.trim() && !file) return;

    setSending(true);

    // Create optimistic message with current system time
    const currentSystemTime = new Date();
    const optimisticMessage: CommentItem = {
      id: `temp-${Date.now()}`, // Temporary ID
      message: messageText,
      attachment: file ? file.name : null,
      user_type: "User",
      user_name: "You",
      created_on: currentSystemTime.toISOString(), // Use exact system time
    };

    console.log("🕐 Using system time:", currentSystemTime.toLocaleString());

    // Add optimistic message immediately
    setMessages((prev) => [...prev, optimisticMessage]);

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
        console.log("Send response:", response);

        if (response?.response === true) {
          // Check if server response contains our message
          const serverMessages = response?.ticket?.comments || [];
          const hasNewMessage = serverMessages.some(
            (msg: any) =>
              msg.message === messageText &&
              msg.user_type?.toLowerCase() === "user"
          );

          if (hasNewMessage) {
            // Server has our message, replace optimistic with real data
            setMessages(serverMessages);
          } else {
            // Server doesn't have our message yet, keep optimistic and fetch
            setTimeout(() => {
              setMessages((prev) =>
                prev.filter((msg) => msg.id !== optimisticMessage.id)
              );
              fetchAllComments();
            }, 1000); // Wait 1 second then fetch
          }
        } else {
          // If send failed, remove the optimistic message
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== optimisticMessage.id)
          );
          console.error("Failed to send message");
        }
      })
      .catch((error: any) => {
        console.error("Failed to send message:", error);
        // Remove optimistic message on error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id)
        );
      })
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <div>
      <Card className="flex flex-col h-full">
        <ChatHeader ticket={ticket} />
        <MessageList messages={messages} />
        <MessageInput onSend={handleSend} sending={sending} />
      </Card>
    </div>
  );
};

export default ChatInterface;
