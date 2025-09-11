import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Lock } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import type { PasswordChangeFormData } from '../../../types';

interface PasswordChangeFormProps {
  isLoading: boolean;
  onSubmit: (values: PasswordChangeFormData) => Promise<void>;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  isLoading,
  onSubmit,
}) => {
  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Please confirm your new password'),
  });

  const form = useFormik<PasswordChangeFormData>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <Card title="Change Password" subtitle="Update your account password">
      <form onSubmit={form.handleSubmit} className="space-y-6">
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Security Requirements</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your new password must be at least 8 characters long and contain:
              </p>
              <ul className="text-xs text-blue-600 mt-2 space-y-1">
                <li>• At least one uppercase letter</li>
                <li>• At least one lowercase letter</li>
                <li>• At least one number</li>
                <li>• At least one special character (@$!%*?&)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={form.values.currentPassword}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.currentPassword ? form.errors.currentPassword : undefined}
            required
            placeholder="Enter your current password"
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={form.values.newPassword}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.newPassword ? form.errors.newPassword : undefined}
            required
            placeholder="Enter your new password"
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={form.values.confirmPassword}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.confirmPassword ? form.errors.confirmPassword : undefined}
            required
            placeholder="Confirm your new password"
          />
        </div>

        {/* Password Strength Indicator */}
        {form.values.newPassword && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Password Strength:</div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((level) => {
                const isActive = form.values.newPassword.length >= level * 2;
                const isStrong = form.values.newPassword.length >= 8 && 
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.values.newPassword);
                
                return (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded ${
                      isActive
                        ? isStrong
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                        : 'bg-gray-200'
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-gray-500">
              {form.values.newPassword.length < 8
                ? 'Password too short'
                : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.values.newPassword)
                ? 'Strong password'
                : 'Password needs more complexity'}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || !form.isValid}
            loading={isLoading}
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PasswordChangeForm;
