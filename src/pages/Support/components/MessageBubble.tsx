import React from 'react';
import { COLORS } from '../../../constants/colors';
import { CommentItem } from './types';
import { isImageUrl, formatDateTime } from './utils';
import ReadMore from './ReadMore';

interface MessageBubbleProps {
  message: CommentItem;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = (message.user_type || "").toLowerCase() === "user";
  const isOptimistic = typeof message.id === 'string' && message.id.startsWith('temp-');

  return (
    <div
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
          <ReadMore text={message.message} limit={150} />
        </div>
        {message.attachment && (
          <div className="mt-2">
            {isImageUrl(message.attachment) ? (
              // show image preview
              <a
                href={message.attachment}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={message.attachment}
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
            {message.user_name || (isUser ? "" : "")}
            {isOptimistic && " (Sending...)"}
          </span>
        </div>
      </div>
      <span className={`text-xs text-${COLORS.GRAY} mt-1  ${isUser ? "text-right" : "text-left"}`}>
        {formatDateTime(message.created_on ?? undefined)}
        {/* {isUser ? "You" : "Support"} */}
      </span>
    </div>
  );
};

export default MessageBubble;
