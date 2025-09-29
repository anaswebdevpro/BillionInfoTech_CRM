import React, { useState } from 'react';
import { limitText } from './utils';

interface ReadMoreProps {
  text: string;
  limit?: number;
  className?: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({ text, limit = 150, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (text.length <= limit) {
    return <span className={className}>{text}</span>;
  }
  
  return (
    <span className={className}>
      {isExpanded ? text : limitText(text, limit)}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`ml-1 text-blue-500 hover:text-blue-700 underline text-xs font-medium`}
      >
        {isExpanded ? "Read less" : "Read more"}
      </button>
    </span>
  );
};

export default ReadMore;
