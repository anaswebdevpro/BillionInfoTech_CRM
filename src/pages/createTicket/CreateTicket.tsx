/* eslint-disable @typescript-eslint/no-explicit-any */

import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import { COLORS } from '../../constants/colors';
import Priority from './Components/Priority';
import Tips from './Components/Tips';
import EmergencyContact from './Components/EmergencyContact';
import { ArrowLeft } from 'lucide-react';
import { CREATE_SUPPORT_TICKET, HELP_DEPARTMENT, TICKET_ENQUIRY_LIST } from '../../../api/api-variable';
import { useAuth } from '@/context';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/services';
import { enqueueSnackbar } from 'notistack';


const CreateTicket = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<any[]>([]);
  const [enquiry, setEnquiry] = useState<any[]>([]);

  // Fetch Departments from API
  const fetchDepartments = () => {
    try {
      apiRequest({
        endpoint: HELP_DEPARTMENT,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response: any) => {
        setDepartments(response.data || []);
        console.log('Departments:', response);
      })
      .catch((error: any) => {
        console.error('Failed to fetch departments:', error);
      });
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  // Fetch Enquiry from API
  const fetchEnquiry = () => {
    try {
      apiRequest({
        endpoint: TICKET_ENQUIRY_LIST,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response: any) => {
        setEnquiry(response.data || []);
        console.log('Enquiry:', response);
      })
      .catch((error: any) => {
        console.error('Failed to fetch enquiry:', error);
      });
    } catch (error) {
      console.error('Failed to fetch enquiry:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEnquiry();
  }, []);

  const priorities = [
    { value: 'low', label: 'Low', time: '24-48 hours', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { value: 'medium', label: 'Medium', time: '12-24 hours', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'high', label: 'High', time: '4-8 hours', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { value: 'urgent', label: 'Urgent', time: '1-2 hours', color: 'bg-red-100 text-red-800 border-red-300' }
  ];
// Handle file selection with validation
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log('📎 Files selected:', files);
    
    if (files.length === 0) return;
    
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      const isValidType = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.txt', '.doc', '.docx']
        .some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!isValidSize) {
        alert(`❌ File "${file.name}" is too large. Maximum size is 5MB.`);
        return false;
      }
      if (!isValidType) {
        alert(`❌ File "${file.name}" has unsupported format. Supported: PNG, JPG, GIF, PDF, TXT, DOC, DOCX`);
        return false;
      }
      
      console.log('✅ Valid file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      return true;
    });
    
    formik.setFieldValue('attachments', validFiles);
  };


  const formik = useFormik({
    initialValues: {
      department: '',
      enquiry: '',
      subject: '',
      priority: 'medium',
      message: '',
      attachments: [] as File[]
    },
    validationSchema: Yup.object({
      department: Yup.string().required('Department is required'),
      enquiry: Yup.string().required('Enquiry type is required'),
      subject: Yup.string().required('Subject is required'),
      priority: Yup.string().required('Priority is required'),
      message: Yup.string().required('Message is required')
    }),
  onSubmit: (values) => {
      console.log('🚀 Submitting form with values:', values);
      
      try {
        const formData = new FormData();
        
        // ✅ Add all required fields
        formData.append("enquiry", String(values.enquiry));
        formData.append("department", String(values.department)); 
        formData.append("message", String(values.message)); 
        formData.append("priority", String(values.priority));
        formData.append("subject", String(values.subject));
        
        // ✅ Fix file handling - Handle single file properly
        if (values.attachments && values.attachments.length > 0) {
          const file = values.attachments[0]; // Get first file
         
          formData.append("attachment", file);
        }
       
        
     
        
        apiRequest({
          endpoint: CREATE_SUPPORT_TICKET,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // ✅ Don't set Content-Type for FormData - browser will set it with boundary
            "Content-Type": "multipart/form-data"
          },
          data: formData,
        })
       // ...existing code...
        .then((response: any) => {
          console.log("✅ API Response:", response);
          
          // ✅ Fix: Check the correct response structure
          if (response.success === true) {
               enqueueSnackbar(response.message,{variant:"success"})       // Reset form
            formik.resetForm();
            // navigate('/dashboard/support');
          } else {
            console.error('❌ API returned error:', response);
           
          }
        })

        
        .catch((error) => {
          console.error("❌ Failed to submit ticket:", error);
          console.error("❌ Error response:", error.response);
          console.error("❌ Error data:", error.response?.data);
          
          // Show more specific error message
          const errorMessage = error.response?.data?.message || 
                              error.response?.data?.error || 
                              error.message ||
                              'An error occurred while submitting the ticket.';
          alert(`❌ ${errorMessage}`);
        });
        
      } catch (error) {
        console.error("❌ Error in form submission:", error);
        alert('❌ An unexpected error occurred.');
      }
    }
  });

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
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-6">
              {/* Department Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map((dept) => (
                    <label key={dept.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="department"
                        value={dept?.id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.department === dept?.id}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 border-2 rounded-lg transition-all hover:bg-gray-50 ${
                          formik.values.department === dept?.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                         onClick={() => {
                          // ✅ Add click handler for better UX
                          console.log('Selecting department:', dept.id);
                          formik.setFieldValue('department', String(dept.id));
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div>
                            <h3 className="font-medium text-gray-900">{dept?.name}</h3>
                            <p className="text-sm text-gray-600">
                              Status: {dept?.status === 1 ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {formik.touched.department && formik.errors.department && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.department}</div>
                )}
              </div>

              {/* Enquiry Type Selection */}
              <div>
                <label htmlFor="enquiry" className="block text-sm font-medium text-gray-700 mb-2">
                  Enquiry Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="enquiry"
                  name="enquiry"
                  value={formik.values.enquiry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formik.errors.enquiry && formik.touched.enquiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select an enquiry type</option>
                  {Array.isArray(enquiry) && enquiry.length > 0 ? (
                    enquiry.map((enq) => (
                      <option key={enq.id} value={enq.id} disabled={enq.status !== 1}>
                        {enq.name} {enq.status !== 1 ? '(Inactive)' : ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading enquiry types...</option>
                  )}
                </select>
                {formik.touched.enquiry && formik.errors.enquiry && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.enquiry}</div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Brief description of your issue"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formik.errors.subject && formik.touched.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formik.touched.subject && formik.errors.subject && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.subject}</div>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {priorities.map((priority) => (
                    <label key={priority.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.priority === priority.value}
                        className="sr-only"
                      />
                      <div className={`p-3 border-2 rounded-lg text-center transition-all hover:opacity-80 ${
                        formik.values.priority === priority.value 
                          ? `${priority.color} border-current` 
                          : 'bg-gray-50 text-gray-700 border-gray-300'
                      }`}>
                        <div className="font-medium">{priority.label}</div>
                        <div className="text-xs mt-1">{priority.time}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {formik.touched.priority && formik.errors.priority && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.priority}</div>
                )}
              </div>

              {/* message */}
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Please provide detailed information about your issue..."
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                    formik.errors.message && formik.touched.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formik.touched.message && formik.errors.message && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
                )}
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-sm text-gray-500 mb-3">PNG, JPG, GIF, PDF, TXT up to 5MB each</p>
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
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 cursor-pointer transition-colors"
                  >
                    Browse Files
                  </label>
                </div>
                {formik.values.attachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    <ul className="text-sm text-gray-800">
                      {(formik.values.attachments as File[]).map((file, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span>• {file.name}</span>
                          <span className="text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  // disabled={formik.isSubmitting}
                  className={`w-full md:w-auto px-6 py-3 rounded-md font-medium transition-colors ${
                    formik.isSubmitting
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {formik.isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Priority />
          <Tips />
          <EmergencyContact />
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;