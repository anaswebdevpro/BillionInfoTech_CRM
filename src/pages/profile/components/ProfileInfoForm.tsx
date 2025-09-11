import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Camera, User } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import type { ProfileFormData, ExtendedUser } from '../../../types';

interface ProfileInfoFormProps {
  profileData: ExtendedUser | null;
  isLoading: boolean;
  onSubmit: (values: ProfileFormData, imageFile: File | null) => Promise<void>;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  profileData,
  isLoading,
  onSubmit,
}) => {
  const [profileImage, setProfileImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be less than 15 digits'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    address: Yup.object({
      street: Yup.string().required('Street address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      country: Yup.string().required('Country is required'),
      zipCode: Yup.string().required('ZIP code is required'),
    }),
    referralCode: Yup.string().max(20, 'Referral code must be less than 20 characters'),
  });

  const form = useFormik<ProfileFormData>({
    initialValues: {
      name: profileData?.name || '',
      email: profileData?.email || '',
      phone: profileData?.phone || '',
      dateOfBirth: profileData?.dateOfBirth || '',
      address: {
        street: profileData?.address?.street || '',
        city: profileData?.address?.city || '',
        state: profileData?.address?.state || '',
        country: profileData?.address?.country || '',
        zipCode: profileData?.address?.zipCode || '',
      },
      referralCode: profileData?.referralCode || '',
      profileImage: profileData?.profileImage || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values, imageFile);
    },
  });

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

  return (
    <Card title="Profile Information" subtitle="Update your personal details">
      <form onSubmit={form.handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profileImage || profileData?.profileImage ? (
                <img
                  src={profileImage || profileData?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="profileImage"
              className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {profileData?.name}
            </h3>
            <p className="text-sm text-gray-500">{profileData?.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Click the camera icon to change your profile picture
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.name ? form.errors.name : undefined}
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.email ? form.errors.email : undefined}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.values.phone}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.phone ? form.errors.phone : undefined}
          />
          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.values.dateOfBirth}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.dateOfBirth ? form.errors.dateOfBirth : undefined}
            required
          />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Address Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Street Address"
              name="address.street"
              type="text"
              value={form.values.address.street}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.address?.street ? form.errors.address?.street : undefined}
              required
            />
            <Input
              label="City"
              name="address.city"
              type="text"
              value={form.values.address.city}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.address?.city ? form.errors.address?.city : undefined}
              required
            />
            <Input
              label="State"
              name="address.state"
              type="text"
              value={form.values.address.state}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.address?.state ? form.errors.address?.state : undefined}
              required
            />
            <Input
              label="Country"
              name="address.country"
              type="text"
              value={form.values.address.country}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.address?.country ? form.errors.address?.country : undefined}
              required
            />
            <Input
              label="ZIP Code"
              name="address.zipCode"
              type="text"
              value={form.values.address.zipCode}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.address?.zipCode ? form.errors.address?.zipCode : undefined}
              required
            />
            <Input
              label="Referral Code"
              name="referralCode"
              type="text"
              value={form.values.referralCode}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.referralCode ? form.errors.referralCode : undefined}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || !form.isValid}
            loading={isLoading}
          >
            {isLoading ? 'Updating Profile...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileInfoForm;
