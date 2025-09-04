import { apiRequest } from './api';
import type { KYCDocument } from '../types';

export const kycAPI = {
  // Get all KYC documents
  async getDocuments(): Promise<KYCDocument[]> {
    try {
      const response = await apiRequest<KYCDocument[]>({
        endpoint: '/kyc/documents',
        method: 'GET'
      });
      return response || [];
    } catch (error) {
      console.error('Error fetching KYC documents:', error);
      return [];
    }
  },

  // Upload KYC document
  async uploadDocument(data: {
    type: string;
    file: File;
    description?: string;
  }): Promise<KYCDocument | null> {
    try {
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('file', data.file);
      if (data.description) {
        formData.append('description', data.description);
      }

      const response = await apiRequest<KYCDocument>({
        endpoint: '/kyc/upload',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Error uploading KYC document:', error);
      return null;
    }
  },

  // Get KYC status
  async getStatus(): Promise<{ status: string; message?: string } | null> {
    try {
      const response = await apiRequest<{ status: string; message?: string }>({
        endpoint: '/kyc/status',
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      return null;
    }
  },

  // Submit KYC for review
  async submitForReview(): Promise<boolean> {
    try {
      await apiRequest({
        endpoint: '/kyc/submit',
        method: 'POST'
      });
      return true;
    } catch (error) {
      console.error('Error submitting KYC for review:', error);
      return false;
    }
  }
};
