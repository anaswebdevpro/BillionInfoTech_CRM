import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  FileText, 
  AlertCircle,
  Users,
  HeadphonesIcon,
  CreditCard,
  Settings as SettingsIcon,
  CheckCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import { HELP_DEPARTMENT } from '../../../api/api-variable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { COLORS } from '../../constants/colors';
import { apiRequest } from '../../services/api';
import { useAuth } from '@/context';
import { createSupportTicket, validateFileUploads, CreateTicketPayload } from './supportTicketUtils';
import Priority from './Components/Priority';

import Tips from './Components/Tips';
import EmergencyContact from './Components/EmergencyContact';

// Support ticket interfaces
export interface Department {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline';
  responseTime: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CreateTicketFormData {
  department: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
}


const validationSchema = Yup.object({
  department: Yup.string().required('Department is required'),
  subject: Yup.string()
    .min(10, 'Subject must be at least 10 characters')
    .max(100, 'Subject must be less than 100 characters')
    .required('Subject is required'),
  priority: Yup.string().required('Priority is required'),
  description: Yup.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .required('Description is required'),
});

/**
 * Create Support Ticket Page
 * Allows users to submit new support tickets with file attachments
 */
const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch departments from API
  const fetchDepartments = useCallback(async () => {
    // Icon mapping for departments
    const departmentIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      '1': SettingsIcon,
      '2': Users,
      '3': HeadphonesIcon,
      '4': CreditCard,
      '5': FileText,
    };

    try {
      const response = await apiRequest<{
        success: boolean;
        data: Array<{
          id: string;
          name: string;
          description: string;
          status: 'online' | 'offline';
          responseTime: string;
        }>;
      }>({
        endpoint: HELP_DEPARTMENT,
        method: 'POST',
        data: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.success && response.data) {
        const departmentsWithIcons = response.data.map(dept => ({
          ...dept,
          icon: departmentIcons[dept.id] || SettingsIcon
        }));
        setDepartments(departmentsWithIcons);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setSubmitError('Failed to load departments');
    }
  }, [token]);

  // Load departments on component mount
  useEffect(() => {
    const loadDepartments = async () => {
      setLoading(true);
      await fetchDepartments();
      setLoading(false);
    };
    loadDepartments();
  }, [fetchDepartments]);

  const formik = useFormik<CreateTicketFormData>({
    initialValues: {
      department: '',
      subject: '',
      priority: 'medium',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitError('');
      setSubmitSuccess('');
      
      try {
        // Validate files first
        const fileValidation = validateFileUploads(uploadedFiles);
        if (fileValidation.errors.length > 0) {
          setSubmitError(fileValidation.errors.join(', '));
          setIsSubmitting(false);
          return;
        }

        // Prepare payload
        const ticketPayload: CreateTicketPayload = {
          department: values.department,
          subject: values.subject,
          priority: values.priority,
          description: values.description,
          attachments: fileValidation.validFiles.length > 0 ? fileValidation.validFiles : undefined,
        };

        // Call API
        if (!token) {
          setSubmitError('Authentication token not found. Please log in again.');
          setIsSubmitting(false);
          return;
        }
        const response = await createSupportTicket(ticketPayload, token);
        
        if (response && response.success) {
          setSubmitSuccess(response.message || 'Support ticket created successfully!');
          // Redirect after a short delay to show success message
          setTimeout(() => {
            navigate('/dashboard/support');
          }, 2000);
        } else {
          setSubmitError(response?.message || 'Failed to create support ticket. Please try again.');
        }
      } catch (error) {
        console.error('Error creating ticket:', error);
        setSubmitError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validation = validateFileUploads([...uploadedFiles, ...files]);
    
    if (validation.errors.length > 0) {
      setSubmitError(validation.errors.join(', '));
      return;
    }
    
    setSubmitError(''); // Clear any previous errors
    setUploadedFiles(prev => [...prev, ...validation.validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/support')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY}`}>Create Support Ticket</h1>
          <p className={`mt-2 text-${COLORS.SECONDARY_TEXT}`}>Submit a new support request</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY} mb-6`}>Ticket Information</h2>
            
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{submitError}</p>
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 text-sm">{submitSuccess}</p>
                </div>
              )}

              {/* Department Selection */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-3`}>
                  Department *
                </label>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading departments...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {departments.map((dept) => {
                      const IconComponent = dept.icon;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => formik.setFieldValue('department', dept.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            formik.values.department === dept.id
                              ? `border-${COLORS.PRIMARY} bg-${COLORS.PRIMARY_BG_LIGHT}`
                              : `border-${COLORS.BORDER} hover:border-${COLORS.GRAY_BORDER}`
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <IconComponent className={`h-5 w-5 mt-1 ${
                              formik.values.department === dept.id 
                                ? `text-${COLORS.PRIMARY_TEXT}` 
                                : `text-${COLORS.GRAY}`
                            }`} />
                            <div>
                              <h3 className={`font-medium text-sm text-${COLORS.SECONDARY}`}>
                                {dept.name}
                              </h3>
                              <p className={`text-xs text-${COLORS.SECONDARY_TEXT} mt-1`}>
                                {dept.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {formik.touched.department && formik.errors.department && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {formik.errors.department}
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <Input
                  label="Subject *"
                  name="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.subject ? formik.errors.subject : undefined}
                  placeholder="Brief description of your issue"
                />
              </div>

              {/* Priority */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-3`}>
                  Priority *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'low', label: 'Low', description: '24-48 hours' },
                    { value: 'medium', label: 'Medium', description: '12-24 hours' },
                    { value: 'high', label: 'High', description: '4-8 hours' },
                    { value: 'urgent', label: 'Urgent', description: '1-2 hours' }
                  ].map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => formik.setFieldValue('priority', priority.value)}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        formik.values.priority === priority.value
                          ? getPriorityColor(priority.value)
                          : `border-${COLORS.BORDER} hover:border-${COLORS.GRAY_BORDER}`
                      }`}
                    >
                      <div className={`font-medium text-sm ${
                        formik.values.priority === priority.value 
                          ? '' 
                          : `text-${COLORS.SECONDARY}`
                      }`}>
                        {priority.label}
                      </div>
                      <div className={`text-xs mt-1 ${
                        formik.values.priority === priority.value 
                          ? '' 
                          : `text-${COLORS.SECONDARY_TEXT}`
                      }`}>
                        {priority.description}
                      </div>
                    </button>
                  ))}
                </div>
                {formik.touched.priority && formik.errors.priority && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {formik.errors.priority}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={6}
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
                  placeholder="Please provide detailed information about your issue..."
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {formik.errors.description}
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>
                  Attachments (Optional)
                </label>
                <div className={`border-2 border-dashed border-${COLORS.BORDER} rounded-lg p-6 text-center`}>
                  <Upload className={`h-8 w-8 mx-auto mb-2 text-${COLORS.GRAY}`} />
                  <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mb-2`}>
                    Drag and drop files here, or click to browse
                  </p>
                  <p className={`text-xs text-${COLORS.GRAY}`}>
                    PNG, JPG, GIF, PDF, TXT up to 5MB each
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.gif,.pdf,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-block mt-3 px-4 py-2 bg-${COLORS.PRIMARY} text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors`}
                  >
                    Browse Files
                  </label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 bg-${COLORS.SECONDARY_BG} rounded-lg`}>
                        <div className="flex items-center space-x-3">
                          <FileText className={`h-5 w-5 text-${COLORS.GRAY}`} />
                          <div>
                            <p className={`text-sm font-medium text-${COLORS.SECONDARY}`}>{file.name}</p>
                            <p className={`text-xs text-${COLORS.SECONDARY_TEXT}`}>{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className={`p-1 hover:bg-${COLORS.BORDER} rounded`}
                        >
                          <X className={`h-4 w-4 text-${COLORS.GRAY}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/support')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formik.isValid}
                  className="min-w-32"
                >
                  {isSubmitting ? 'Creating...' : 'Create Ticket'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Response Times */}
          <Priority />

          {/* Tips */}
          <Tips />

          {/* Emergency Contact */}
         <EmergencyContact/>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
