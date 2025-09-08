import { apiRequest } from '../../services/api';
import { CREATE_SUPPORT_TICKET } from '../../../api/api-variable';

// Support ticket interfaces
export interface CreateTicketPayload {
  department: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  attachments?: File[];
}

export interface CreateTicketResponse {
  success: boolean;
  message: string;
  ticket?: {
    id: string;
    ticketNumber: string;
    status: string;
    createdAt: string;
  };
}

// Support ticket functions
export async function createSupportTicket(
  ticketData: CreateTicketPayload,
  token: string
): Promise<CreateTicketResponse | null> {
  try {
    // If there are attachments, we need to send as FormData
    if (ticketData.attachments && ticketData.attachments.length > 0) {
      const formData = new FormData();
      
      // Add text fields
      formData.append('department', ticketData.department);
      formData.append('subject', ticketData.subject);
      formData.append('priority', ticketData.priority);
      formData.append('description', ticketData.description);
      
      // Add files
      ticketData.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      // Make API call with FormData using fetch for file uploads
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://amf.billioninfotech.com/api/v1'}${CREATE_SUPPORT_TICKET}`, {
        method: 'POST',
        headers: {
          // Don't set Content-Type for FormData, let the browser set it
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log("✅ Support Ticket Created:", result);
      return result;
    } else {
      // No files, send as JSON using apiRequest
      const payload = {
        department: ticketData.department,
        subject: ticketData.subject,
        priority: ticketData.priority,
        description: ticketData.description,
      };

      const response = await apiRequest<CreateTicketResponse, typeof payload>({
        endpoint: CREATE_SUPPORT_TICKET,
        method: "POST",
        data: payload,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response;
    }
  } catch (error) {
    console.error("❌ Error creating support ticket:", error);
    return null;
  }
}

export function validateFileUploads(files: File[]) {
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'text/plain'
  ];
  const maxFiles = 5;

  const errors: string[] = [];
  const validFiles: File[] = [];

  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed`);
    return { errors, validFiles: [] };
  }

  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1}: Invalid file type. Only JPG, PNG, GIF, PDF, and TXT files are allowed.`);
      return;
    }

    if (file.size > maxFileSize) {
      errors.push(`File ${index + 1}: File size exceeds 5MB limit.`);
      return;
    }

    validFiles.push(file);
  });

  return { errors, validFiles };
}
