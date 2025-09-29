import React from 'react';
import { COLORS } from '../../../constants/colors';
import { TicketPayload } from './types';
import { formatDateTime } from './utils';

interface ChatHeaderProps {
  ticket?: TicketPayload | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ ticket }) => {
  return (
    <div className={`flex items-center justify-between p-2 border-b border-${COLORS.BORDER}`}>
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
  );
};

export default ChatHeader;
