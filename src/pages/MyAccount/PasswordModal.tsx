import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/ui/Button';
import { UPDATE_ACCOUNT_PASSWORD } from '../../../api/api-variable';
import { apiRequest } from '@/services';
import { useAuth } from '@/context';
import { enqueueSnackbar } from 'notistack';


interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountNumber: number;
}

interface PasswordFormValues {
  passwordType: string;
  newPassword: string;
}

const passwordTypeOptions = [
  { value: 'INVESTOR', label: 'Investor' },
  { value: 'MAIN', label: 'Main' },
 
];

const validationSchema = Yup.object({
  passwordType: Yup.string(),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
});

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, accountNumber }) => {
  const {token}= useAuth();
  if (!isOpen) return null;

  const initialValues: PasswordFormValues = {
    passwordType: 'INVESTOR',
    newPassword: '',
  };

  const handleSubmit = (values: PasswordFormValues) => {
    console.log('Password change request:', {
      accountNumber,
      passwordType: values.passwordType,
      newPassword: values.newPassword,
    });
    const requestBody = {
      account_number:accountNumber,
      pass_type: values.passwordType,
      account_password: values.newPassword,
    };
    try {
        apiRequest({
          endpoint: UPDATE_ACCOUNT_PASSWORD,
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          data: requestBody
        })
        .then((response: unknown) => {
          console.log("Password update response:", response);
          
          // Check if response indicates success or failure
          const responseData = response as { response?: boolean; message?: string };          
          if (responseData.response === false) {
            // Show error message
            enqueueSnackbar(responseData.message || 'Password update failed!', { variant: 'error' });
          } else {
            // Show success message
            enqueueSnackbar(responseData.message || 'Password updated successfully!', { variant: 'success' });
          }
        })
        .catch((error) => {
          console.error('Error updating password:', error);
          // Extract error message from the error object
          const errorMessage = error?.response?.data?.message || 'Failed to update password';
          enqueueSnackbar(errorMessage, { variant: 'error' });
        })
       
      } catch (error) {
        console.error("Failed to submit values:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Change Account Password</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-6">
                {/* Password Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Type:
                  </label>
                  <div className="relative">
                    <Field
                      as="select"
                      name="passwordType"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                    >
                      {passwordTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <ErrorMessage name="passwordType" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password:
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="px-6"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-6 bg-green-600 hover:bg-green-700"
                  >
                    Update Password
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;