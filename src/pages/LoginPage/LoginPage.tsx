/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Input from "../../components/ui/Input";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { ShimmerText, ShimmerButton } from "../../components/ui/Shimmer";
import type { LoginFormData } from "../../types";
import { IoMdTime } from "react-icons/io";
import { RiSecurePaymentLine } from "react-icons/ri";
import laptop from "../../assets/lapi.png";
import logo from "../../assets/company-logo 1.png";
import { COLORS, GRADIENTS } from "../../constants/colors";
import { apiRequest } from "../../services/api";
import { LOGIN } from "../../../api/api-variable";
import { useAuth } from "../../context/AuthContext/AuthContext";

interface LoginPageProps {
  onSwitchToSignup?: () => void;
}




/**
 * Login page component based on the Billion InfoTech Design
 * Handles user authentication with email and password
 */
const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Simulate page loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik form handling
  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const payload = JSON.stringify({
          email: values.email,
          password: values.password,
        });
        apiRequest({
          endpoint: LOGIN,
          method: "POST",
          data: payload,
        })
          .then((response: any) => {
            // Use the login function from AuthContext
            login(response?.user, response?.token);
            setIsLoading(false);
            navigate("/dashboard");
            console.log(response);
          })
          .catch((error: any) => {
            console.error("Login failed:", error);
            setIsLoading(false);
            formik.setFieldError("password", "Invalid email or password");
          });
      } catch (error) {
        console.error("Login failed:", error);
        setIsLoading(false);
        formik.setFieldError("password", "Invalid email or password");
      } 
    },
  });

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Branding Shimmer */}
        <div className="max-w-[35%] hidden md:block items-center justify-center">
          <div className={`${GRADIENTS.SIDEBAR} w-full h-screen flex justify-center flex-col items-center p-10`}>
            <div className="h-32 w-32 bg-white/20 rounded-lg animate-pulse mb-8"></div>
            <div className="h-48 w-48 bg-white/20 rounded-lg animate-pulse mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-white/20 rounded w-80 animate-pulse"></div>
              <div className="flex gap-4 px-4 my-5">
                <div className="h-6 bg-white/20 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form Shimmer */}
        <div className={`flex-1 flex items-center justify-center p-12 bg-${COLORS.SECONDARY_BG}`}>
          <div className={`w-full max-w-md border border-${COLORS.BORDER} bg-${COLORS.WHITE} rounded-lg ${COLORS.SHADOW} p-8`}>
            <div className="text-center mb-8">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <ShimmerText width="60px" height={16} />
                <ShimmerText width="100%" height={40} />
              </div>
              <div className="space-y-2">
                <ShimmerText width="80px" height={16} />
                <ShimmerText width="100%" height={40} />
              </div>
              <div className="text-right">
                <ShimmerText width="120px" height={16} />
              </div>
              <ShimmerButton width="100%" height={40} />
              <div className="text-center">
                <ShimmerText width="200px" height={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="max-w-[35%] hidden md:block items-center justify-center">
  <div className={`${GRADIENTS.SIDEBAR} w-full h-screen flex justify-center flex-col items-center p-10`}>
          <img src={logo} alt="Billion Infotech" className="w-40 " />
          <img src={laptop} alt="Billion Infotech" className="" />
          <div className="">
            <h1 className={`text-${COLORS.WHITE} text-4xl font-bold`}>
              Manage. <span className={`text-${COLORS.SECONDARY}`}>Monitor.</span> Grow.
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

      {/* Right side - Login form */}
  <div className={`flex-1 flex items-center justify-center p-12 bg-${COLORS.SECONDARY_BG}` }>
  <div className={`w-full max-w-md border border-${COLORS.BORDER} bg-${COLORS.WHITE} rounded-lg ${COLORS.SHADOW} p-8`}>
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold text-${COLORS.SECONDARY} mb-2`}>
              Billion Infotech
            </h2>
            <h4 className={`text-2xl font-bold text-${COLORS.PRIMARY} mb-2`}>Login</h4>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
              label="Email"
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

            <div className="text-right">
              <a
                href="#"
                className={`text-sm text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.SECONDARY} underline`}
              >
                Forgot password?
              </a>
            </div>

              <Button
                type="submit"
                className={`w-full flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
             
                {isLoading ? (
                  <>
                    <svg className={`animate-spin h-5 w-5 mr-2 text-${COLORS.PRIMARY}`} viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Verifying...
                  </>
                ) : "Verify"}
              </Button>

            <div className="text-center">
              <p className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchToSignup) {
                      onSwitchToSignup();
                    }
                    navigate("/signup");
                  }}
                  className={`font-medium text-${COLORS.PRIMARY} hover:text-${COLORS.PRIMARY_BG} underline`}
                >
                  Sign up now
                </button>
              </p>
            </div>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
