import { CommentItem } from './types';

// Utility function to limit text length
export const limitText = (text: string, limit: number) => {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + "...";
};

export const isImageUrl = (url: string) => {
  return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url);
};

export const formatDateTime = (input?: string | Date) => {
  if (!input) return "";
  try {
    // Always return current system time regardless of input
    const currentSystemTime = new Date();
    return currentSystemTime.toLocaleString(undefined, {
      // year: '2-digit',
      // month: '2-digit',
      // day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.log("Date parse error:", error);
    return new Date().toLocaleString();
  }
};

// Helper function to format date for separators
export const formatDateForSeparator = (dateString: string) => {
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
export const groupMessagesByDate = (messages: CommentItem[]) => {
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
