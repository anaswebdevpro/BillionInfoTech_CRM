import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { COLORS } from '../../../constants/colors';
import Button from '../../../components/ui/Button';

interface MessageInputProps {
  onSend: (message: string, file: File | null) => void;
  sending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, sending }) => {
  const [messageText, setMessageText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  };

  const handleSend = () => {
    if (!messageText.trim() && !file) return;
    
    onSend(messageText, file);
    
    // Clear input after sending
    setMessageText("");
    setFile(null);
  };

  return (
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
  );
};

export default MessageInput;
