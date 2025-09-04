

import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, CreditCard, Camera, Building2, Hash, Lock, FileText, Trash2 } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { apiRequest } from '../services/api';
import { GET_PROFILE, PROFILE_UPDATE, UPDATE_PASSWORD, ADD_BANK_ACCOUNT, FETCH_BANK_DETAILS, DELETE_BANK_ACCOUNT } from '../../api/api-variable';
import type { ProfileFormData, PasswordChangeFormData, BankDetailsFormData, BankAccount, User as UserType } from '../types';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';

// Tab types
type TabType = 'profile' | 'password' | 'kyc' | 'bank';

// Extended user interface for profile data
interface ExtendedUser extends UserType {
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  referralCode?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  walletBalance?: number;
  status?: string;
}

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
  const [profileImage, setProfileImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState<ExtendedUser | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  
  // Get user data from AuthContext
  const { user, token } = useAuth();

  // Tab configuration
  const tabs = [
    { id: 'profile' as TabType, label: 'Profile Info', icon: User },
    { id: 'password' as TabType, label: 'Change Password', icon: Lock },
    { id: 'kyc' as TabType, label: 'KYC Verification', icon: FileText },
    { id: 'bank' as TabType, label: 'Bank Details', icon: CreditCard },
  ];

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
      console.log('API Response:', response); // Debug log
      
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
      console.error('❌ Error fetching bank details:', error);
    });
  }, [token]);

  // Profile form validation
  const profileValidationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format')
      .min(10, 'Phone number must be at least 10 digits')
      .required('Phone number is required'),
    dateOfBirth: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required'),
    referralCode: Yup.string()
      .min(6, 'Referral code must be at least 6 characters')
      .max(20, 'Referral code must be less than 20 characters'),
  });

  // Password change validation
  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  // Bank details validation
  const bankValidationSchema = Yup.object({
    bankName: Yup.string()
      .min(2, 'Bank name must be at least 2 characters')
      .max(100, 'Bank name must be less than 100 characters')
      .required('Bank name is required'),
    accountHolderName: Yup.string()
      .min(2, 'Account holder name must be at least 2 characters')
      .max(100, 'Account holder name must be less than 100 characters')
      .required('Account holder name is required'),
    accountNumber: Yup.string()
      .min(8, 'Account number must be at least 8 digits')
      .max(20, 'Account number must be less than 20 digits')
      .required('Account number is required'),
    routingNumber: Yup.string()
      .min(8, 'Routing number must be at least 8 digits')
      .max(15, 'Routing number must be less than 15 digits')
      .required('Routing number is required'),
    swiftCode: Yup.string()
      .min(8, 'SWIFT code must be at least 8 characters')
      .max(11, 'SWIFT code must be less than 11 characters'),
    iban: Yup.string()
      .min(15, 'IBAN must be at least 15 characters')
      .max(34, 'IBAN must be less than 34 characters'),
  });

  // Profile form handling
  const profileForm = useFormik<ProfileFormData>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
      referralCode: '',
      profileImage: '',
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('dateOfBirth', values.dateOfBirth);
        formData.append('referralCode', values.referralCode);
        
        if (imageFile) {
          formData.append('profileImage', imageFile);
        }

        const response = await apiRequest({
          endpoint: PROFILE_UPDATE,
          method: 'PUT',
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }) as { user?: ExtendedUser; success?: boolean; message?: string };

        if (response?.user || response?.success) {
          fetchProfileData();
          console.log('Profile updated successfully');
        } else {
          profileForm.setFieldError('email', response?.message || 'Profile update failed');
        }
      } catch (error) {
        console.error('Profile update failed:', error);
        profileForm.setFieldError('email', 'Profile update failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Password change form handling
  const passwordForm = useFormik<PasswordChangeFormData>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await apiRequest({
          endpoint: UPDATE_PASSWORD,
          method: 'PUT',
          data: {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }) as { success?: boolean; message?: string };

        if (response?.success) {
          passwordForm.resetForm();
          console.log('Password updated successfully');
        } else {
          passwordForm.setFieldError('currentPassword', response?.message || 'Password update failed');
        }
      } catch (error) {
        console.error('Password update failed:', error);
        passwordForm.setFieldError('currentPassword', 'Password update failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Bank details form handling
  const bankForm = useFormik<BankDetailsFormData>({
    initialValues: {
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      routingNumber: '',
      swiftCode: '',
      iban: '',
    },
    validationSchema: bankValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Convert camelCase to snake_case for API
        const apiData = {
          bank_name: values.bankName,
          account_holder_name: values.accountHolderName,
          account_number: values.accountNumber,
          routing_number: values.routingNumber,
          swift_code: values.swiftCode,
          iban: values.iban,
        };

        console.log('Sending bank account data:', apiData); // Debug log

        const response = await apiRequest({
          endpoint: ADD_BANK_ACCOUNT,
          method: 'POST',
          data: apiData,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }) as { success?: boolean; message?: string };

        console.log('Add bank account response:', response); // Debug log

        if (response?.success) {
          bankForm.resetForm();
          fetchBankDetails(); // Refresh bank accounts list
          alert('Bank account added successfully!');
          console.log('Bank account added successfully');
        } else {
          bankForm.setFieldError('bankName', response?.message || 'Failed to add bank account');
        }
      } catch (error) {
        console.error('Bank account addition failed:', error);
        bankForm.setFieldError('bankName', 'Failed to add bank account. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Delete bank account
  const deleteBankAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this bank account?')) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest({
        endpoint: `${DELETE_BANK_ACCOUNT}/${accountId}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }) as { success?: boolean; message?: string };

      if (response?.success) {
        fetchBankDetails(); // Refresh bank accounts list
        console.log('Bank account deleted successfully');
      } else {
        console.error('Failed to delete bank account:', response?.message);
        alert('Failed to delete bank account. Please try again.');
      }
    } catch (error) {
      console.error('Bank account deletion failed:', error);
      alert('Failed to delete bank account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    if (token) {
      fetchProfileData();
      fetchBankDetails();
    } else if (user) {
      setProfileData(user as ExtendedUser);
    }
  }, [user, token, fetchProfileData, fetchBankDetails]);

  // Update form values when profileData changes
  useEffect(() => {
    if (profileData) {
      const userData = profileData || user;
      
      profileForm.setValues({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        dateOfBirth: userData?.dateOfBirth || '',
        address: {
          street: userData?.address?.street || '',
          city: userData?.address?.city || '',
          state: userData?.address?.state || '',
          country: userData?.address?.country || '',
          zipCode: userData?.address?.zipCode || '',
        },
        referralCode: userData?.referralCode || '',
        profileImage: userData?.profileImage || '',
      });
      setProfileImage(userData?.profileImage || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  // Handle image upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileInfo();
      case 'password':
        return renderPasswordChange();
      case 'kyc':
        return renderKYCVerification();
      case 'bank':
        return renderBankDetails();
      default:
        return renderProfileInfo();
    }
  };

  // Profile Info Tab Content
  const renderProfileInfo = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-4`}>Personal Info</h2>
      
      <form onSubmit={profileForm.handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="mb-6">
          <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>Profile Picture</label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-20 h-20 rounded-full bg-${COLORS.BORDER} flex items-center justify-center overflow-hidden`}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className={`h-10 w-10 text-${COLORS.GRAY}`} />
                )}
              </div>
              <label className={`absolute bottom-0 right-0 bg-${COLORS.PRIMARY} rounded-full p-1 cursor-pointer hover:bg-green-700 transition-colors`}>
                <Camera className={`h-3 w-3 text-${COLORS.WHITE}`} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            type="text"
            name="name"
            placeholder="Company"
            value={profileForm.values.name}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={profileForm.touched.name && profileForm.errors.name ? profileForm.errors.name : undefined}
          />

          <Input
            label="Last Name"
            type="text"
            placeholder="Horizon"
            value={profileData?.lastName || 'Horizon'}
            disabled
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="billioninfotech@gmail.com"
            value={profileForm.values.email}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={profileForm.touched.email && profileForm.errors.email ? profileForm.errors.email : undefined}
          />

          <Input
            label="Phone"
            type="tel"
            name="phone"
            placeholder="35345345"
            value={profileForm.values.phone}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={profileForm.touched.phone && profileForm.errors.phone ? profileForm.errors.phone : undefined}
          />

          <Input
            label="Referral Code"
            type="text"
            name="referralCode"
            placeholder="51481256"
            value={profileForm.values.referralCode}
            onChange={profileForm.handleChange}
            onBlur={profileForm.handleBlur}
            error={profileForm.touched.referralCode && profileForm.errors.referralCode ? profileForm.errors.referralCode : undefined}
          />

          <Input
            label="Wallet Balance ($)"
            type="text"
            placeholder="0"
            value={profileData?.walletBalance?.toString() || '0'}
            disabled
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>Status</label>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className={`flex items-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Details'}
          </Button>
        </div>
      </form>
    </div>
  );

  // Password Change Tab Content
  const renderPasswordChange = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-4`}>Change Password</h2>
      
      <form onSubmit={passwordForm.handleSubmit} className="space-y-6">
        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          placeholder="Enter current password"
          value={passwordForm.values.currentPassword}
          onChange={passwordForm.handleChange}
          onBlur={passwordForm.handleBlur}
          error={passwordForm.touched.currentPassword && passwordForm.errors.currentPassword ? passwordForm.errors.currentPassword : undefined}
          icon={<Lock className={`h-5 w-5 text-${COLORS.GRAY}`} />}
          required
        />

        <Input
          label="New Password"
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={passwordForm.values.newPassword}
          onChange={passwordForm.handleChange}
          onBlur={passwordForm.handleBlur}
          error={passwordForm.touched.newPassword && passwordForm.errors.newPassword ? passwordForm.errors.newPassword : undefined}
          icon={<Lock className={`h-5 w-5 text-${COLORS.GRAY}`} />}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={passwordForm.values.confirmPassword}
          onChange={passwordForm.handleChange}
          onBlur={passwordForm.handleBlur}
          error={passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword ? passwordForm.errors.confirmPassword : undefined}
          icon={<Lock className={`h-5 w-5 text-${COLORS.GRAY}`} />}
          required
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className={`flex items-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  );

  // KYC Verification Tab Content
  const renderKYCVerification = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-4`}>KYC Verification</h2>
      <div className="text-center p-8">
        <FileText className={`h-16 w-16 mx-auto mb-4 text-${COLORS.GRAY}`} />
        <h3 className={`text-lg font-medium text-${COLORS.SECONDARY} mb-2`}>KYC Verification</h3>
        <p className={`text-${COLORS.SECONDARY_TEXT} mb-4`}>Upload your documents for verification</p>
        <Button>Upload Documents</Button>
      </div>
    </div>
  );

  // Bank Details Tab Content
  const renderBankDetails = () => (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-4`}>Bank Details</h2>
      
      <form onSubmit={bankForm.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Bank Name"
            type="text"
            name="bankName"
            placeholder="Enter bank name"
            value={bankForm.values.bankName}
            onChange={bankForm.handleChange}
            onBlur={bankForm.handleBlur}
            error={bankForm.touched.bankName && bankForm.errors.bankName ? bankForm.errors.bankName : undefined}
            icon={<Building2 className={`h-5 w-5 text-${COLORS.GRAY}`} />}
            required
          />

          <Input
            label="Account Holder Name"
            type="text"
            name="accountHolderName"
            placeholder="Enter account holder name"
            value={bankForm.values.accountHolderName}
            onChange={bankForm.handleChange}
            onBlur={bankForm.handleBlur}
            error={bankForm.touched.accountHolderName && bankForm.errors.accountHolderName ? bankForm.errors.accountHolderName : undefined}
            icon={<User className={`h-5 w-5 text-${COLORS.GRAY}`} />}
            required
          />

          <Input
            label="Account Number"
            type="text"
            name="accountNumber"
            placeholder="Enter account number"
            value={bankForm.values.accountNumber}
            onChange={bankForm.handleChange}
            onBlur={bankForm.handleBlur}
            error={bankForm.touched.accountNumber && bankForm.errors.accountNumber ? bankForm.errors.accountNumber : undefined}
            icon={<Hash className={`h-5 w-5 text-${COLORS.GRAY}`} />}
            required
          />

          <Input
            label="Routing Number"
            type="text"
            name="routingNumber"
            placeholder="Enter routing number"
            value={bankForm.values.routingNumber}
            onChange={bankForm.handleChange}
            onBlur={bankForm.handleBlur}
            error={bankForm.touched.routingNumber && bankForm.errors.routingNumber ? bankForm.errors.routingNumber : undefined}
            icon={<Hash className={`h-5 w-5 text-${COLORS.GRAY}`} />}
            required
          />

          <Input
            label="SWIFT Code"
            type="text"
            name="swiftCode"
            placeholder="Enter SWIFT code (optional)"
            value={bankForm.values.swiftCode}
            onChange={bankForm.handleChange}
            onBlur={bankForm.handleBlur}
            error={bankForm.touched.swiftCode && bankForm.errors.swiftCode ? bankForm.errors.swiftCode : undefined}
            icon={<CreditCard className={`h-5 w-5 text-${COLORS.GRAY}`} />}
          />

          <Input
            label="IBAN"
            type="text"
            name="iban"
            placeholder="Enter IBAN (optional)"
            value={bankForm.values.iban}
            onChange={bankForm.handleChange}
            onBlur={bankForm.handleBlur}
            error={bankForm.touched.iban && bankForm.errors.iban ? bankForm.errors.iban : undefined}
            icon={<CreditCard className={`h-5 w-5 text-${COLORS.GRAY}`} />}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className={`flex items-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Bank Account'}
          </Button>
        </div>
      </form>

      {/* Bank Accounts List */}
      {bankAccounts.length > 0 && (
        <div className="mt-8">
          <h3 className={`text-lg font-semibold text-${COLORS.SECONDARY} mb-4`}>Saved Bank Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.filter(account => account && account.id).map((account) => (
              <Card key={account.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building2 className={`h-5 w-5 text-${COLORS.PRIMARY}`} />
                      <h4 className={`font-semibold text-${COLORS.SECONDARY}`}>{account.bankName || 'Unknown Bank'}</h4>
                      {account.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className={`h-4 w-4 text-${COLORS.GRAY}`} />
                        <span className={`text-${COLORS.SECONDARY_TEXT}`}>{account.accountHolderName || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Hash className={`h-4 w-4 text-${COLORS.GRAY}`} />
                        <span className={`text-${COLORS.SECONDARY_TEXT}`}>
                          ****{account.accountNumber ? account.accountNumber.slice(-4) : '****'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Hash className={`h-4 w-4 text-${COLORS.GRAY}`} />
                        <span className={`text-${COLORS.SECONDARY_TEXT}`}>
                          Routing: {account.routingNumber || 'N/A'}
                        </span>
                      </div>
                      
                      {account.swiftCode && (
                        <div className="flex items-center space-x-2">
                          <CreditCard className={`h-4 w-4 text-${COLORS.GRAY}`} />
                          <span className={`text-${COLORS.SECONDARY_TEXT}`}>
                            SWIFT: {account.swiftCode}
                          </span>
                        </div>
                      )}
                      
                      {account.iban && (
                        <div className="flex items-center space-x-2">
                          <CreditCard className={`h-4 w-4 text-${COLORS.GRAY}`} />
                          <span className={`text-${COLORS.SECONDARY_TEXT}`}>
                            IBAN: {account.iban}
                          </span>
                        </div>
                      )}
                      
                      <div className={`text-xs text-${COLORS.GRAY} mt-2`}>
                        Added: {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteBankAccount(account.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 ml-3"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {bankAccounts.length === 0 && !isLoading && (
        <div className="mt-8 text-center py-6">
          <CreditCard className={`h-12 w-12 mx-auto mb-3 text-${COLORS.GRAY}`} />
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>No bank accounts added yet</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY}`}>Account Information</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? `bg-${COLORS.PRIMARY} text-white`
                  : `text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.SECONDARY}`
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <Card className="shadow-lg">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
};

export default Profile;

