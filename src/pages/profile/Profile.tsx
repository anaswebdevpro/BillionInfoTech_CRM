import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { ShimmerLoader } from '../../components/ui';
import { apiRequest } from '../../services/api';
import { GET_PROFILE, PROFILE_UPDATE, UPDATE_PASSWORD, ADD_BANK_ACCOUNT, FETCH_BANK_DETAILS, DELETE_BANK_ACCOUNT } from '../../../api/api-variable';
import type { ProfileFormData, PasswordChangeFormData, BankDetailsFormData, BankAccount, ExtendedUser } from '../../types';

// Import Profile Components
import {
  ProfileTabs,
  ProfileInfoForm,
  PasswordChangeForm,
  BankDetailsForm,
  KYCVerification
} from './components';

// Tab types
type TabType = 'profile' | 'password' | 'kyc' | 'bank';

// API Bank Account Response interface
interface ApiBankAccount {
  id: number;
  user_id: number;
  bank_name: string;
  account_number: string;
  account_holder: string;
  routing_number?: string;
  swift_code?: string;
  iban?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ExtendedUser | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  
  // Get user data from AuthContext and snackbar hook
  const { user, token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
console.log(token);
  // Function to fetch profile data from API
  const fetchProfileData = useCallback(() => {
    if (!token) return;
    
    setIsLoading(true);
    
    apiRequest({
      endpoint: GET_PROFILE,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response) {
        setProfileData(response as ExtendedUser);
        console.log('✅ Profile data fetched:', response);
      } else {
        setProfileData(user as ExtendedUser);
      }
    })
    .catch((error) => {
      console.error('❌ Error fetching profile data:', error);
      setProfileData(user as ExtendedUser);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [token, user]);

  // Function to fetch bank details
  const fetchBankDetails = useCallback(() => {
    if (!token) return;
    
    apiRequest({
      endpoint: FETCH_BANK_DETAILS,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((response) => {
      const responseData = response as { data?: ApiBankAccount[]; bankAccounts?: ApiBankAccount[] } | ApiBankAccount[];
      console.log('API Response:', response);
      
      let rawAccounts: ApiBankAccount[] = [];
      
      if (Array.isArray(responseData)) {
        rawAccounts = responseData;
      } else if (responseData?.data || responseData?.bankAccounts) {
        rawAccounts = responseData.data || responseData.bankAccounts || [];
      }
      
      // Map API response to our interface
      const mappedAccounts: BankAccount[] = rawAccounts.map((account) => ({
        id: account.id?.toString() || Math.random().toString(),
        bankName: account.bank_name || 'Unknown Bank',
        accountHolderName: account.account_holder || 'N/A',
        accountNumber: account.account_number || '',
        routingNumber: account.routing_number || '',
        swiftCode: account.swift_code || '',
        iban: account.iban || '',
        isDefault: account.is_default || false,
        createdAt: account.created_at || new Date().toISOString(),
      }));
      
      setBankAccounts(mappedAccounts);
      console.log('✅ Bank details mapped and set:', mappedAccounts);
    })
    .catch((error) => {
      console.error(' Error fetching bank details:', error);
    });
  }, [token]);

  // Load data on component mount
  useEffect(() => {
    fetchProfileData();
    fetchBankDetails();
  }, [fetchProfileData, fetchBankDetails]);

  // Profile form submission
  const handleProfileSubmit = async (values: ProfileFormData, imageFile: File | null) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('middle_name', values.middle_name || '');
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('isd_code', values.isd_code.toString());
      formData.append('address', values.address || '');
      formData.append('city', values.city || '');
      formData.append('state', values.state || '');
      formData.append('country', values.country || '');
      formData.append('zip_code', values.zip_code || '');
      formData.append('referral_code', values.referral_code || '');
      
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const response = await apiRequest({
        endpoint: PROFILE_UPDATE,
        method: 'POST',
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }) as { user?: ExtendedUser; success?: boolean; message?: string };

      if (response?.user || response?.success) {
        await fetchProfileData();
        enqueueSnackbar(response?.message || 'Profile updated successfully!', { variant: 'success' });
        console.log('Profile updated successfully');
      } else {
        throw new Error(response?.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Profile update failed. Please try again.', { variant: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Password change form submission
  const handlePasswordSubmit = async (values: PasswordChangeFormData) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest({
        endpoint: UPDATE_PASSWORD,
        method: 'POST',
        data: {
          password: values.currentPassword,
          new_password: values.newPassword,
          confirm_password: values.confirmPassword,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }) as { success?: boolean; message?: string };

      if (!response?.success) {
        throw new Error(response?.message || 'Password update failed');
      }
      
      enqueueSnackbar(response?.message || 'Password updated successfully!', { variant: 'success' });
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Password update failed:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Password update failed. Please try again.', { variant: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Bank account form submission
  const handleAddBankAccount = async (values: BankDetailsFormData) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      // Map form data to API expected format
      const apiData = {
        account_holder_name: values.accountHolderName,
        account_number: values.accountNumber,
        ifsc_code: values.iban, // Using iban field for IFSC code as per API
        bank_name: values.bankName
      };

      const response = await apiRequest({
        endpoint: ADD_BANK_ACCOUNT,
        method: 'POST',
        data: apiData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }) as { success?: boolean; message?: string };

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to add bank account');
      }
      
      await fetchBankDetails();
      enqueueSnackbar(response?.message || 'Bank account added successfully!', { variant: 'success' });
      console.log('Bank account added successfully');
    } catch (error) {
      console.error('Failed to add bank account:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to add bank account. Please try again.', { variant: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete bank account
  const handleDeleteBankAccount = async (accountId: string) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest({
        endpoint: `${DELETE_BANK_ACCOUNT}/${accountId}`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }) as { success?: boolean; message?: string };

      if (!response?.success) {
        throw new Error(response?.message || 'Failed to delete bank account');
      }
      
      await fetchBankDetails();
      enqueueSnackbar(response?.message || 'Bank account deleted successfully!', { variant: 'success' });
      console.log('Bank account deleted successfully');
    } catch (error) {
      console.error('Failed to delete bank account:', error);
      enqueueSnackbar(error instanceof Error ? error.message : 'Failed to delete bank account. Please try again.', { variant: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileInfoForm
            profileData={profileData}
            isLoading={isLoading}
            onSubmit={handleProfileSubmit}
          />
        );
      case 'password':
        return (
          <PasswordChangeForm
            isLoading={isLoading}
            onSubmit={handlePasswordSubmit}
          />
        );
      case 'kyc':
        return <KYCVerification profileData={profileData} />;
      case 'bank':
        return (
          <BankDetailsForm
            bankAccounts={bankAccounts}
            isLoading={isLoading}
            onAddBankAccount={handleAddBankAccount}
            onDeleteBankAccount={handleDeleteBankAccount}
          />
        );
      default:
        return null;
    }
  };


  // Show loading state
  if (isLoading && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ShimmerLoader variant="profile" width={800} height={600} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information, security settings, and preferences.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;