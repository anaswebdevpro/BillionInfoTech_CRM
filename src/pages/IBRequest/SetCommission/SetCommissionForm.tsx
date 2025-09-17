import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { apiRequest } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { COMMISSION_SETTINGS, UPDATE_COMMISSION_SETTINGS } from '../../../../api/api-variable';

// Types

export interface responseData {
  title: string;
  groups: {
    id: number;
    name: string;
    symbol: string;
    curid: number;
  }[];
  platforms: {
    id: number;
    name: string;
    slug: string;
    status: number;
  }[];
  categories: {
    id: number;
    name: string;
    slug: string;
    status: number;
  }[];
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
  const { enqueueSnackbar } = useSnackbar();
  const locationState = location.state as LocationState;
  const [data, setData] = useState<responseData | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const FetchData = () => {
      setIsLoading(true);
      try {
        apiRequest({
          endpoint: COMMISSION_SETTINGS,
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
        
        .then((response: unknown) => {
          console.log('Commission Settings Data:', response);        
          setIsLoading(false);
          setData(response as responseData);
        }) 
          .catch((error: Error) => {
         setIsLoading(false);
            console.error('Failed to fetch Commission Settings:', error);
            enqueueSnackbar('Failed to fetch Commission Settings data: ' + error.message, { variant: 'error' });
          });
      } catch (error) {
        setIsLoading(false);
        console.error('Failed to fetch Commission Settings:', error);
        enqueueSnackbar('Failed to fetch Commission Settings. Please try again.', { variant: 'error' });
      }
    };  

    FetchData();
  }, [token, enqueueSnackbar]);




















  // Redirect if no user data provided
  useEffect(() => {
    if (!locationState?.userId) {
      navigate('/dashboard/set-commission');
    }
  }, [locationState, navigate]);

  // Validation schema
  const validationSchema = Yup.object({
    platformType: Yup.string()
      .required('Platform type is required'),
    accountType: Yup.string()
      .required('Account type is required'),
    tradeCategory: Yup.string()
      .required('Trade category is required'),
    downlineNetwork: Yup.string()
      .required('Downline network is required'),
    shareCommission: Yup.number()
      .min(0, 'Share commission cannot be negative')
      .max(100, 'Share commission cannot exceed 100%')
      .required('Share commission is required')
  });

  // Formik hook
  const formik = useFormik({
    initialValues: {
      platformType: '',
      accountType: '',
      tradeCategory: '',
      downlineNetwork: 'All',
      shareCommission: 0
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
    
        const payload = {
          share_commission: values.shareCommission,
          user_id: locationState?.userId,        // from location state
          platform_id: data?.platforms.find(p => p.slug === values.platformType)?.id || null,
          group_id: [
            data?.groups.find(g => g.name === values.accountType)?.id || null
          ].filter(Boolean), // ensure no null
          trade_category: [
            data?.categories.find(c => c.slug === values.tradeCategory)?.id || null
          ].filter(Boolean),
          from_user_id: locationState?.userId    // adjust if you want a different value
        };
    
        console.log("Sending payload:", payload);
    
        apiRequest({
          endpoint: UPDATE_COMMISSION_SETTINGS,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          data: payload
        })
          .then((response: unknown) => {
            setIsLoading(false);
            console.log("Commission Settings updated:", response);
            enqueueSnackbar("Commission Settings updated successfully", { variant: "success" });
          })
          .catch((error: Error) => {
            setIsLoading(false);
            console.error("Failed to update Commission Settings:", error);
            enqueueSnackbar("Failed to update Commission Settings data: " + error.message, { variant: "error" });
          });
      } catch (error) {
        setIsLoading(false);
        console.error("Failed to update Commission Settings:", error);
        enqueueSnackbar("Failed to update Commission Settings. Please try again.", { variant: "error" });
      }
    
      }
     
    });

    

  // Handle cancel
  const handleCancel = () => {
    navigate('/dashboard/set-commission');
  };






  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Income Settings</h1>
          </div>
          <p className="text-gray-600">Configure commission settings for trading accounts</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Top Filter Section */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Platform:</label>
              <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                <option value="">Select Platform</option>
                {data?.platforms?.map((platform) => (
                  <option key={platform.id} value={platform.slug}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Account Type:</label>
              <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                <option value="">Select Account Type</option>
                {data?.groups?.map((group) => (
                  <option key={group.id} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Downline Network:</label>
              <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                <option value="All">All</option>
                <option value="Direct">Direct</option>
                <option value="Level1">Level 1</option>
                <option value="Level2">Level 2</option>
                <option value="Level3">Level 3</option>
              </select>
            </div>
          </div>

          {/* Commission Categories Table */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 bg-gray-100">
                <div className="font-medium text-gray-700">Categories</div>
                <div className="font-medium text-gray-700">Assigned Commission</div>
                <div className="font-medium text-gray-700">Shared Commission</div>
                <div className="font-medium text-gray-700">Own Commission</div>
              </div>
              <div className="p-8 text-center text-gray-500">
                No record found!
              </div>
            </div>
          </div>

          {/* Commission Settings Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Platform Type */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32">Platform Type:</label>
                <select
                  name="platformType"
                  value={formik.values.platformType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formik.touched.platformType && formik.errors.platformType ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select Platform Type</option>
                  {data?.platforms?.map((platform) => (
                    <option key={platform.id} value={platform.slug}>
                      {platform.name}
                    </option>
                  ))}
                </select>
                {formik.touched.platformType && formik.errors.platformType && (
                  <p className="text-red-500 text-xs">{formik.errors.platformType}</p>
                )}
              </div>

              {/* Account Type */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32">Account Type:</label>
                <select
                  name="accountType"
                  value={formik.values.accountType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formik.touched.accountType && formik.errors.accountType ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select Account Type</option>
                  {data?.groups?.map((group) => (
                    <option key={group.id} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {formik.touched.accountType && formik.errors.accountType && (
                  <p className="text-red-500 text-xs">{formik.errors.accountType}</p>
                )}
              </div>

              {/* Trade Category */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32">Trade Category:</label>
                <select
                  name="tradeCategory"
                  value={formik.values.tradeCategory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formik.touched.tradeCategory && formik.errors.tradeCategory ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select Trade Category</option>
                  {data?.categories?.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formik.touched.tradeCategory && formik.errors.tradeCategory && (
                  <p className="text-red-500 text-xs">{formik.errors.tradeCategory}</p>
                )}
              </div>

              {/* Downline Network */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32">Downline Network:</label>
                <select
                  name="downlineNetwork"
                  value={formik.values.downlineNetwork}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formik.touched.downlineNetwork && formik.errors.downlineNetwork ? 'border-red-500' : ''
                  }`}
                >
                  <option value="All">All</option>
                  <option value="Direct">Direct</option>
                  <option value="Level1">Level 1</option>
                  <option value="Level2">Level 2</option>
                  <option value="Level3">Level 3</option>
                </select>
                {formik.touched.downlineNetwork && formik.errors.downlineNetwork && (
                  <p className="text-red-500 text-xs">{formik.errors.downlineNetwork}</p>
                )}
              </div>

              {/* Share Commission */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32">Share Commission:</label>
                <input
                  type="number"
                  name="shareCommission"
                  value={formik.values.shareCommission}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  step="0.01"
                  min="0"
                  max="100"
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formik.touched.shareCommission && formik.errors.shareCommission ? 'border-red-500' : ''
                  }`}
                  placeholder="0"
                />
                {formik.touched.shareCommission && formik.errors.shareCommission && (
                  <p className="text-red-500 text-xs">{formik.errors.shareCommission}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
           
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isLoading || !formik.isValid}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Settings'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetCommissionForm;