import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../../../constants/colors';
import { apiRequest } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext/AuthContext';

// Types
interface CommissionFormData {
  userId: string | number;
  userEmail: string;
  userName: string;
  commissionType: string;
  commissionRate: number;
  minVolume: number;
  maxVolume: number;
  effectiveDate: string;
  status: 'active' | 'inactive';
  notes: string;
}

interface FormErrors {
  userId?: string;
  userEmail?: string;
  userName?: string;
  commissionType?: string;
  commissionRate?: string;
  minVolume?: string;
  maxVolume?: string;
  effectiveDate?: string;
  status?: string;
  notes?: string;
}

interface LocationState {
  userId: string | number;
  userEmail: string;
  userName: string;
}

const SetCommissionForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const locationState = location.state as LocationState;

  const [formData, setFormData] = useState<CommissionFormData>({
    userId: locationState?.userId || '',
    userEmail: locationState?.userEmail || '',
    userName: locationState?.userName || '',
    commissionType: 'percentage',
    commissionRate: 0,
    minVolume: 0,
    maxVolume: 0,
    effectiveDate: new Date().toISOString().split('T')[0],
    status: 'active',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Redirect if no user data provided
  useEffect(() => {
    if (!locationState?.userId) {
      navigate('/dashboard/set-commission');
    }
  }, [locationState, navigate]);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.commissionRate || formData.commissionRate <= 0) {
      newErrors.commissionRate = 'Commission rate must be greater than 0';
    }

    if (formData.commissionRate > 100) {
      newErrors.commissionRate = 'Commission rate cannot exceed 100%';
    }

    if (formData.minVolume < 0) {
      newErrors.minVolume = 'Minimum volume cannot be negative';
    }

    if (formData.maxVolume < 0) {
      newErrors.maxVolume = 'Maximum volume cannot be negative';
    }

    if (formData.maxVolume > 0 && formData.minVolume > formData.maxVolume) {
      newErrors.maxVolume = 'Maximum volume must be greater than minimum volume';
    }

    if (!formData.effectiveDate) {
      newErrors.effectiveDate = 'Effective date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest({
        endpoint: '/api/set-commission', // Replace with your actual endpoint
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: formData
      });

      // Success - redirect back to list
      navigate('/dashboard/set-commission', { 
        state: { message: 'Commission settings updated successfully!' } 
      });
    } catch (error) {
      console.error('Failed to save commission settings:', error);
      // Handle error (you might want to show a toast or error message)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/dashboard/set-commission');
  };

  return (
    <div className={`min-h-screen bg-${COLORS.SECONDARY_BG} py-6`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleCancel}
              className={`text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY}/80 transition-colors`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Set Commission</h1>
          </div>
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>
            Configure commission settings for {formData.userName} ({formData.userEmail})
          </p>
        </div>

        {/* Form */}
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-6`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Information (Read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
                  User ID
                </label>
                <input
                  type="text"
                  value={formData.userId}
                  disabled
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md bg-gray-50 text-gray-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.userEmail}
                  disabled
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md bg-gray-50 text-gray-500`}
                />
              </div>
            </div>

            {/* Commission Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
                  Commission Type *
                </label>
                <select
                  name="commissionType"
                  value={formData.commissionType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="tiered">Tiered Commission</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
                  Commission Rate * {formData.commissionType === 'percentage' ? '(%)' : '($)'}
                </label>
                <input
                  type="number"
                  name="commissionRate"
                  value={formData.commissionRate}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max={formData.commissionType === 'percentage' ? '100' : undefined}
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent ${
                    errors.commissionRate ? 'border-red-500' : ''
                  }`}
                />
                {errors.commissionRate && (
                  <p className="text-red-500 text-xs mt-1">{errors.commissionRate}</p>
                )}
              </div>
            </div>

            {/* Volume Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
                  Minimum Volume
                </label>
                <input
                  type="number"
                  name="minVolume"
                  value={formData.minVolume}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent ${
                    errors.minVolume ? 'border-red-500' : ''
                  }`}
                />
                {errors.minVolume && (
                  <p className="text-red-500 text-xs mt-1">{errors.minVolume}</p>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
                  Maximum Volume (0 for unlimited)
                </label>
                <input
                  type="number"
                  name="maxVolume"
                  value={formData.maxVolume}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent ${
                    errors.maxVolume ? 'border-red-500' : ''
                  }`}
                />
                {errors.maxVolume && (
                  <p className="text-red-500 text-xs mt-1">{errors.maxVolume}</p>
                )}
              </div>
            </div>

            {/* Date and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
                  Effective Date *
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent ${
                    errors.effectiveDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.effectiveDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.effectiveDate}</p>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
                placeholder="Add any additional notes or comments..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 bg-${COLORS.PRIMARY} text-white rounded-md hover:bg-${COLORS.PRIMARY}/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Commission Settings'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={`px-6 py-2 border border-${COLORS.BORDER} text-${COLORS.SECONDARY} rounded-md hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetCommissionForm;