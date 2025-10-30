/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckSquare,
  Square,
} from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ShimmerLoader } from "../../components/ui";
import { apiRequest } from "../../services/api";
import laptop from "../../assets/lapi.png";
import logo from "../../assets/company-logo 1.png";
import { useNavigate } from "react-router-dom";
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoMdTime } from "react-icons/io";
import { SIGNUP } from "../../../api/api-variable";
import { COLORS, GRADIENTS } from "../../constants/colors";

interface SignupPageProps {
  onSignup: (token: string) => void;
  onSwitchToLogin: () => void;
}

interface SignupFormData {
  referralCode?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
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
    referralCode: Yup.string()
      .optional()
      .max(50, "Referral code must be less than 50 characters"),
    firstName: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .required("First name is required"),
    middleName: Yup.string()
      .max(50, "Middle name must be less than 50 characters")
      .optional(),
    lastName: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    country: Yup.string().required("Country is required"),
    phone: Yup.string()
      .min(10, "Phone must be at least 10 characters")
      .required("Phone number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
    agreeToTerms: Yup.boolean()
      .oneOf([true], "You must agree to the terms and conditions")
      .required("You must agree to the terms and conditions"),
  });

  // Formik form handling
  const formik = useFormik<SignupFormData>({
    initialValues: {
      referralCode: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      country: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const payload = JSON.stringify({
          referral_code: values.referralCode,
          first_name: values.firstName,
          middle_name: values.middleName,
          last_name: values.lastName,
          email: values.email,
          country: values.country,
          phone: values.phone,
          password: values.password,
          password_confirmation: values.confirmPassword,
          agreeToTerms: values.agreeToTerms,
        });
        apiRequest({
          endpoint: SIGNUP,
          method: "POST",
          data: payload,
        })
          .then((response: any) => {
            localStorage.setItem("token", response?.token);
            localStorage.setItem("user", JSON.stringify(response?.user));
            setIsLoading(false);
            navigate("/dashboard");
          })
          .catch((error: any) => {
            console.error("Signup failed:", error);
            setIsLoading(false);
            formik.setFieldError("email", "Signup failed. Please try again.");
          });
      } catch (error) {
        console.error("Signup failed:", error);
        if (error instanceof Error) {
          formik.setFieldError("email", error.message);
        } else {
          formik.setFieldError("email", "Signup failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Branding */}
        <div className="max-w-[35%] hidden md:block items-center justify-center">
          <div
            className={`${GRADIENTS.SIDEBAR} w-full h-screen flex justify-center flex-col items-center p-10`}
          >
            <img src={logo} alt="Billion Infotech" className="w-40 " />
            <img src={laptop} alt="Billion Infotech" className="" />
            <div className="">
              <h1 className={`text-${COLORS.WHITE} text-4xl font-bold`}>
                Manage.{" "}
                <span className={`text-${COLORS.SECONDARY}`}>Monitor.</span>{" "}
                Grow.
              </h1>
              <div className="flex gap-4 px-4 my-5">
                <p className="text-xl font-extrabold">
                  <RiSecurePaymentLine className="inline-block" /> SSL Secure
                  Login
                </p>
                <p className="text-xl font-extrabold">
                  <IoMdTime className="inline-block" />
                  99% Uptime{" "}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup form shimmer */}
        <div
          className={`flex-1 flex items-center justify-center p-12 bg-${COLORS.SECONDARY_BG}`}
        >
          <ShimmerLoader variant="form" width={400} height={600} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="max-w-[35%] hidden md:block items-center justify-center">
        <div
          className={`${GRADIENTS.SIDEBAR} w-full h-screen flex justify-center flex-col items-center p-10`}
        >
          <img src={logo} alt="Billion Infotech" className="w-40 " />
          <img src={laptop} alt="Billion Infotech" className="" />
          <div className="">
            <h1 className={`text-${COLORS.WHITE} text-4xl font-bold`}>
              Manage.{" "}
              <span className={`text-${COLORS.SECONDARY}`}>Monitor.</span> Grow.
            </h1>
            <div className="flex gap-4 px-4 my-5">
              <p className="text-xl font-extrabold">
                <RiSecurePaymentLine className="inline-block" /> SSL Secure
                Login
              </p>
              <p className="text-xl font-extrabold">
                <IoMdTime className="inline-block" />
                99% Uptime{" "}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div
        className={`flex-1 flex items-center justify-center p-6 bg-${COLORS.SECONDARY_BG} overflow-y-auto`}
      >
        <div
          className={`w-full max-w-2xl border border-${COLORS.BORDER} bg-${COLORS.WHITE} rounded-lg ${COLORS.SHADOW} p-8`}
        >
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold text-${COLORS.SECONDARY} mb-2`}>
              Billion Infotech
            </h2>
            <h4 className={`text-2xl font-bold text-${COLORS.PRIMARY} mb-2`}>
              Create Account
            </h4>
            <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
              Join us and start trading today
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* SPONSOR SECTION - Referral Code */}
            <div>
              <label
                className={`block text-xs font-bold text-${COLORS.SECONDARY} mb-2  tracking-wide`}
              >
                Referral Code
              </label>
              <Input
                type="text"
                name="referralCode"
                placeholder="Referral Code (Optional)"
                value={formik.values.referralCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.referralCode && formik.errors.referralCode
                    ? formik.errors.referralCode
                    : undefined
                }
              />
            </div>

            {/* NAME FIELDS - 3 Columns */}
            <div>
              <label
                className={`block text-xs font-bold text-${COLORS.SECONDARY} mb-2  tracking-wide`}
              >
                Basic Details
              </label>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && formik.errors.firstName
                      ? formik.errors.firstName
                      : undefined
                  }
                  icon={<User className={`h-5 w-5 text-${COLORS.GRAY}`} />}
                  required
                />
                <Input
                  label="Middle Name"
                  type="text"
                  name="middleName"
                  placeholder="Middle Name (Opt)"
                  value={formik.values.middleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.middleName && formik.errors.middleName
                      ? formik.errors.middleName
                      : undefined
                  }
                />
                <Input
                  label="last Name"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && formik.errors.lastName
                      ? formik.errors.lastName
                      : undefined
                  }
                  icon={<User className={`h-5 w-5 text-${COLORS.GRAY}`} />}
                  required
                />
              </div>
            </div>

            {/* Email, Country, Phone - 3 Columns */}
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Email "
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : undefined
                }
                icon={<Mail className={`h-5 w-5 text-${COLORS.GRAY}`} />}
                required
              />

              <div>
                <label
                  className={`block text-xs font-semibold text-${COLORS.SECONDARY} mb-1  tracking-wide`}
                >
                  Country
                </label>
                <select
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 text-sm border border-${COLORS.BORDER} rounded-lg focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} bg-${COLORS.WHITE}`}
                >
                  <option value="">Select Country</option>
                  <option value="IND">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="CAN">Canada</option>
                  <option value="AUS">Australia</option>
                  {/* Add more countries as needed */}
                </select>
                {formik.touched.country && formik.errors.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.country}
                  </p>
                )}
              </div>

              <Input
                label="phone"
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : undefined
                }
                required
              />
            </div>

            {/* Password Fields - 2 Columns */}
            <div className="grid grid-cols-2 gap-3">
              {/* Password Input */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : undefined
                  }
                  icon={<Lock className={`h-5 w-5 text-${COLORS.GRAY}`} />}
                  required
                />
                <button
                  type="button"
                  className={`absolute right-3 top-8 text-${COLORS.GRAY} hover:text-${COLORS.SECONDARY_TEXT}`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? formik.errors.confirmPassword
                      : undefined
                  }
                  icon={<Lock className={`h-5 w-5 text-${COLORS.GRAY}`} />}
                  required
                />
                <button
                  type="button"
                  className={`absolute right-3 top-8 text-${COLORS.GRAY} hover:text-${COLORS.SECONDARY_TEXT}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <button
                type="button"
                className="flex-shrink-0 mt-1"
                onClick={() =>
                  formik.setFieldValue(
                    "agreeToTerms",
                    !formik.values.agreeToTerms
                  )
                }
              >
                {formik.values.agreeToTerms ? (
                  <CheckSquare className={`h-5 w-5 text-${COLORS.PRIMARY}`} />
                ) : (
                  <Square className={`h-5 w-5 text-${COLORS.GRAY}`} />
                )}
              </button>
              <div className="text-xs">
                <label className={`text-${COLORS.SECONDARY_TEXT}`}>
                  I agree to the{" "}
                  <a
                    href="#"
                    className={`text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY_BG} underline font-medium`}
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className={`text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY_BG} underline font-medium`}
                  >
                    Privacy Policy
                  </a>
                </label>
                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.agreeToTerms}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? "REGISTERING..." : "REGISTER"}
            </Button>

            {/* Switch to Login */}
            <div className="text-center pt-2">
              <p className={`text-xs text-${COLORS.SECONDARY_TEXT}`}>
                Already have account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className={`font-medium text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY_BG} underline`}
                >
                  Sign in
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
