import React from 'react';
import { FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface KYCVerificationProps {
  profileData: any;
}

const KYCVerification: React.FC<KYCVerificationProps> = ({ profileData }) => {
  // Mock KYC status - in real app, this would come from API
  const kycStatus = profileData?.kycStatus || 'pending';
  const kycDocuments = profileData?.kycDocuments || [];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'KYC Verified',
          description: 'Your identity has been successfully verified.',
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          title: 'KYC Pending',
          description: 'Your documents are under review. This usually takes 1-3 business days.',
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          title: 'KYC Rejected',
          description: 'Your documents were rejected. Please upload new documents.',
        };
      default:
        return {
          icon: FileText,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          title: 'KYC Not Started',
          description: 'Please complete your KYC verification to access all features.',
        };
    }
  };

  const statusInfo = getStatusInfo(kycStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* KYC Status */}
      <Card title="KYC Verification Status" subtitle="Identity verification status">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-full ${statusInfo.bgColor}`}>
            <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${statusInfo.color}`}>
              {statusInfo.title}
            </h3>
            <p className="text-gray-600 mt-1">{statusInfo.description}</p>
            {kycStatus === 'rejected' && (
              <p className="text-sm text-red-600 mt-2">
                Reason: Document quality is insufficient. Please ensure all documents are clear and readable.
              </p>
            )}
          </div>
        </div>
      </Card>

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
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Back side</span>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
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
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
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
                {kycDocuments.map((doc: any, index: number) => (
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
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        doc.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status}
                      </span>
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
          {kycStatus !== 'verified' && (
            <div className="flex justify-end">
              <Button variant="primary" size="lg">
                Submit for Verification
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KYCVerification;
