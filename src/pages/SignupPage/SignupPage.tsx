/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Mail, Lock, User, CheckSquare, Square } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { apiRequest } from '../../services/api';
import laptop from '../../assets/lapi.png';
import logo from '../../assets/company-logo 1.png';
import type { SignupFormData } from '../../types';
import { useNavigate } from 'react-router-dom';
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoMdTime } from "react-icons/io";
import { SIGNUP } from '../../../api/api-variable';
import { COLORS, GRADIENTS } from '../../constants/colors';


interface SignupPageProps {
  onSignup: (token: string) => void;
  onSwitchToLogin: () => void;
}

/**
 * Signup page component following the same design as Login page
 * Handles user registration with form validation using Formik
 */
const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
    agreeToTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
      .required('You must agree to the terms and conditions'),
  });

  // Formik form handling
  const formik = useFormik<SignupFormData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const payload = JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.confirmPassword,
          agreeToTerms: values.agreeToTerms,
        });
       apiRequest({
          endpoint: SIGNUP,
          method: 'POST',
          data: payload,
        }).then((response:any) => {
          localStorage.setItem("token", response?.token);
          localStorage.setItem("user", JSON.stringify(response?.user));
          setIsLoading(false);
          navigate("/dashboard");
        })
        .catch((error:any) => {
          console.error("Signup failed:", error);
          setIsLoading(false);
          formik.setFieldError("email", "Signup failed. Please try again.");
        });
      } catch (error) {
        console.error('Signup failed:', error);
        if (error instanceof Error) {
          formik.setFieldError('email', error.message);
        } else {
          formik.setFieldError('email', 'Signup failed. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="max-w-[35%] hidden md:block items-center justify-center">
        <div className={`${GRADIENTS.SIDEBAR} w-full h-screen flex justify-center flex-col items-center p-10`}>

          
          <img src={logo} alt="Billion Infotech" className="w-40 " />
          <img src={laptop} alt="Billion Infotech" className="" />
          <div className=''>
            <h1 className={`text-${COLORS.WHITE} text-4xl font-bold`}>Manage. <span className={`text-${COLORS.SECONDARY}`}>Monitor.</span> Grow.</h1>
         <div className='flex gap-4 px-4 my-5'>

         <p className='text-xl font-extrabold'>
          <RiSecurePaymentLine className="inline-block" /> SSL Secure Login</p>
            <p className='text-xl font-extrabold'>  
               <IoMdTime className="inline-block" /> 
                99% Uptime </p>
         </div>

          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
  <div className={`flex-1 flex items-center justify-center p-12 bg-${COLORS.SECONDARY_BG}` }>
  <div className={`w-full max-w-md border border-${COLORS.BORDER} bg-${COLORS.WHITE} rounded-lg ${COLORS.SHADOW} p-8`}>
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold text-${COLORS.SECONDARY} mb-2`}>Billion Infotech</h2>
            <h4 className={`text-2xl font-bold text-${COLORS.PRIMARY} mb-2`}>Create Account</h4>
            <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Join us and start trading today</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
              icon={<User className={`h-5 w-5 text-${COLORS.GRAY}`} />}
              required
            />

            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              icon={<Mail className={`h-5 w-5 text-${COLORS.GRAY}`} />}
              required
            />

            {/* Password Input */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a strong password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                icon={<Lock className={`h-5 w-5 text-${COLORS.GRAY}`} />}
                required
              />
              <button
                type="button"
                className={`absolute right-3 top-8 text-${COLORS.GRAY} hover:text-${COLORS.SECONDARY_TEXT}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
                icon={<Lock className={`h-5 w-5 text-${COLORS.GRAY}`} />}
                required
              />
              <button
                type="button"
                className={`absolute right-3 top-8 text-${COLORS.GRAY} hover:text-${COLORS.SECONDARY_TEXT}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-3">
              <button
                type="button"
                className="flex-shrink-0 mt-1"
                onClick={() => formik.setFieldValue('agreeToTerms', !formik.values.agreeToTerms)}
              >
                {formik.values.agreeToTerms ? (
                  <CheckSquare className={`h-5 w-5 text-${COLORS.PRIMARY}`} />
                ) : (
                  <Square className={`h-5 w-5 text-${COLORS.GRAY}`} />
                )}
              </button>
              <div className="text-sm">
                <label className="text-gray-700">
                  I agree to the{' '}
                  <a href="#" className={`text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY_BG} underline`}>
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className={`text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY_BG} underline`}>
                    Privacy Policy
                  </a>
                </label>
                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.agreeToTerms}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Switch to Login */}
            <div className="text-center">
              <p className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className={`font-medium text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY_BG} underline`}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
