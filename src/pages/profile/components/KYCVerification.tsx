import React, { useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { apiRequest } from '../../../services/api';
import { UPLOAD_DOCUMENT } from '../../../../api/api-variable';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { enqueueSnackbar } from 'notistack';

interface KYCVerificationProps {
  profileData: {
    kycDocuments?: Array<{
      name: string;
      uploadedAt: string;
      status: string;
    }>;
  } | null;
}

interface DocumentFile {
  file: File;
  type: 'government_id_front' | 'government_id_back' | 'proof_of_address';
  name: string;
}

// API field mapping
const getApiFieldName = (type: DocumentFile['type']): string => {
  switch (type) {
    case 'government_id_front': return 'add_proof_f';
    case 'government_id_back': return 'add_proof_b';
    case 'proof_of_address': return 'file';
    default: return 'file';
  }
};

const getApiTypeValue = (type: DocumentFile['type']): string => {
  switch (type) {
    case 'government_id_front': return 'add_proof_f';
    case 'government_id_back': return 'add_proof_b';
    case 'proof_of_address': return 'add_proof_address';
    default: return 'add_proof_b';
  }
};

const KYCVerification: React.FC<KYCVerificationProps> = ({ profileData }) => {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<DocumentFile[]>([]);
  const kycDocuments = profileData?.kycDocuments || [];

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentFile['type']) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDocument: DocumentFile = {
        file,
        type,
        name: file.name
      };
      setSelectedFiles(prev => [...prev.filter(doc => doc.type !== type), newDocument]);
    }
  };

  // Handle upload button click
  const handleUploadClick = (type: DocumentFile['type']) => {
    const input = document.getElementById(type) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  // Remove selected file
  const removeFile = (type: DocumentFile['type']) => {
    setSelectedFiles(prev => prev.filter(doc => doc.type !== type));
  };

  // Upload all selected documents at once
  const handleUploadDocuments = async () => {
    if (selectedFiles.length === 0) {
      enqueueSnackbar('Please select at least one document to upload', { variant: 'warning' });
      return;
    }

    if (uploading) {
      enqueueSnackbar('Please wait, upload is in progress', { variant: 'warning' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      
      // Add type field (required by API) - use the first document's type
      formData.append('type', getApiTypeValue(selectedFiles[0].type));
      
      // Add all files with their correct API field names
      selectedFiles.forEach((doc) => {
        formData.append(getApiFieldName(doc.type), doc.file);
      });

      const response = await apiRequest({
        endpoint: UPLOAD_DOCUMENT,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        data: formData,
      });

      console.log('Upload response:', response);

      // Check if response is null (unexpected error)
      if (!response) {
        enqueueSnackbar('Failed to upload documents. Please try again.', { variant: 'error' });
        return;
      }

      // Check if it's a success response
      if ((response as { success?: boolean })?.success === true) {
        enqueueSnackbar('All documents uploaded successfully!', { variant: 'success' });
        // Clear all selected files
        setSelectedFiles([]);
        // Reset all file inputs
        const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
        inputs.forEach(input => input.value = '');
      } else {
        // Handle error response - extract the message
        const errorMessage = (response as { message?: string })?.message || 'Upload failed';
        console.log('Error message from API:', errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
        
        // If it's an "already uploaded" error, clear the files
        if (errorMessage.includes('already uploaded')) {
          setSelectedFiles([]);
          const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
          inputs.forEach(input => input.value = '');
        }
      }
    } catch (error) {
      console.error('Document upload failed:', error);
      enqueueSnackbar('Failed to upload documents. Please try again.', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Required Documents */}
      <Card title="Required Documents" subtitle="Upload the following documents for verification">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Government ID */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Government ID</h4>
              <p className="text-sm text-gray-600 mb-4">
                Driver's license, passport, or national ID card
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Front side</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="government_id_front"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileSelect(e, 'government_id_front')}
                    />
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        type="button"
                        onClick={() => handleUploadClick('government_id_front')}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </Button>
                      {selectedFiles.find(f => f.type === 'government_id_front') && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {selectedFiles.find(f => f.type === 'government_id_front')?.name}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile('government_id_front')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Back side</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="government_id_back"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileSelect(e, 'government_id_back')}
                    />
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        type="button"
                        onClick={() => handleUploadClick('government_id_back')}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </Button>
                      {selectedFiles.find(f => f.type === 'government_id_back') && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {selectedFiles.find(f => f.type === 'government_id_back')?.name}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile('government_id_back')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proof of Address */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Proof of Address</h4>
              <p className="text-sm text-gray-600 mb-4">
                Utility bill, bank statement, or government document (less than 3 months old)
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Document</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="proof_of_address"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileSelect(e, 'proof_of_address')}
                    />
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        type="button"
                        onClick={() => handleUploadClick('proof_of_address')}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </Button>
                      {selectedFiles.find(f => f.type === 'proof_of_address') && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {selectedFiles.find(f => f.type === 'proof_of_address')?.name}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile('proof_of_address')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Document Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All documents must be clear and readable</li>
              <li>• Documents must be in color (not black and white)</li>
              <li>• File formats: JPG, PNG, or PDF</li>
              <li>• Maximum file size: 10MB per document</li>
              <li>• Documents must be valid and not expired</li>
            </ul>
          </div>

          {/* Uploaded Documents */}
          {kycDocuments.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
              <div className="space-y-2">
                {kycDocuments.map((doc, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleUploadDocuments}
              disabled={uploading || selectedFiles.length === 0}
              loading={uploading}
            >
              {uploading ? 'Uploading Documents...' : 'Submit for Verification'}
            </Button>
          </div>
          {selectedFiles.length > 0 && (
            <div className="text-center text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              Ready to upload {selectedFiles.length} document(s). Click "Submit for Verification" to upload all documents at once.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KYCVerification;