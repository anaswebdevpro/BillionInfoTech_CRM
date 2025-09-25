/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { CheckCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { apiRequest } from "../../services/api";
import type { AccountCreationFormData } from "../../types/index";
import { CREATE_TRADE_ACCOUNT_OPTIONS, OPEN_MT_ACCOUNT } from "../../../api/api-variable";
import { useAuth } from "@/context";


/**
 * Trading Account Creation page component
 * Allows users to create new trading accounts with various configurations
 */
const TradingAccountCreation: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [options, setOptions] = useState<any>(null);
  
  const {token}= useAuth();

  // Function to generate random 8-digit password
  const generateRandomPassword = (): string => {
    let text = "";
    const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const small = "abcdefghijklmnopqrstuvwxyz";
    const number = "0123456789";
    const splchar = "!@$%()";
    for (let i = 0; i < 3; i++)
      text += caps.charAt(Math.floor(Math.random() * caps.length));
    for (let i = 0; i < 2; i++)
      text += small.charAt(Math.floor(Math.random() * small.length));
    for (let i = 0; i < 3; i++)
      text += number.charAt(Math.floor(Math.random() * number.length));
    for (let i = 0; i < 1; i++)
      text += splchar.charAt(Math.floor(Math.random() * splchar.length));
    return text;

   
  };





  // Fetch account types dropdown and other options from API
 const fetchOptions = () => {
    try {
      apiRequest({
        endpoint: CREATE_TRADE_ACCOUNT_OPTIONS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response: any) => {
          setOptions(response);
        console.log('data:', response);
      })
      .catch((error: any) => {
        console.error('Failed to fetch options:', error);
      });
    } catch (error) {
      console.error('Failed to fetch options :', error);
    }
  };

  useEffect(() => {fetchOptions();
    },[]
  );








  // Validation schema for account creation
  const validationSchema = Yup.object({
    platformType: Yup.string()     
      .required("Platform type is required"),
    accountVariant: Yup.string()     
      .required("Account variant is required"),
    accountType: Yup.string().required("Account type is required"),
    currency: Yup.string()
    
      .required("Currency is required"),
    leverage: Yup.string()
     
      .required("Leverage is required"),
    investorPassword: Yup.string()
      .min(8, "Investor password must be 8 characters")
      .required("Investor password is required"),
    masterPassword: Yup.string()
      .min(8, "Master password must be 8 characters")
      .required("Master password is required"),
   
  });

  // Form handling with Formik
  const formik = useFormik<AccountCreationFormData>({
    initialValues: {
      platformType: "", // Will be set to platform ID
      accountVariant: "Demo",
      accountType: "", // Will be set to account type ID
      currency: "", // Will be set to currency ID
      leverage: "", // Will be set to leverage ID
      investorPassword: generateRandomPassword(),
      masterPassword: generateRandomPassword(),
      
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Map form values to API required fields
        const apiData = {
          type: values.accountVariant.toLowerCase(), // "Demo" -> "demo", "Live" -> "live"
          account_type: parseInt(values.accountType), // Convert to number
          currency_id: parseInt(values.currency), // Convert to number
          leverage_id: parseInt(values.leverage), // Convert to number
          platform: parseInt(values.platformType), // Convert to number
          password: values.investorPassword,
          master_password: values.masterPassword
        };

        console.log('Submitting API data:', apiData);

        await apiRequest({
          endpoint: OPEN_MT_ACCOUNT,
          method: 'POST',
          data: apiData,
          headers: { Authorization: `Bearer ${token}` },
        });
      
        formik.resetForm();
        console.log('Account created successfully!');
      } catch (error) {
        console.error("Failed to create account:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

 

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Trading Account
        </h1>
        <p className="text-gray-600">
          Set up a new trading account with your preferred configuration
        </p>
      </div>

      <Card>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Platform Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Type <span className="text-red-500">*</span>
            </label>
            <select
              name="platformType"
              value={formik.values.platformType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Platform</option>
              {options?.data?.platforms?.map((platform: any) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
            {formik.touched.platformType && formik.errors.platformType && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.platformType}
              </p>
            )}
          </div>

          {/* Account Variant Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Account Variant <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["Demo", "Live"].map((type) => (
                <label
                  key={type}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formik.values.accountVariant === type
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="accountVariant"
                    value={type}
                    checked={formik.values.accountVariant === type}
                    onChange={formik.handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {type} Account
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {type === "Demo"
                        ? "Practice trading with virtual money"
                        : "Trade with real money"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Account Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={formik.values.accountType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Account Type</option>
              {options?.data?.accountsType?.map((group: any) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {formik.touched.accountType && formik.errors.accountType && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.accountType}
              </p>
            )}
          </div>

          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Currency <span className="text-red-500">*</span>
            </label>
            <select
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Currency</option>
              {options?.data?.currencies?.map((currency: any) => (
                <option key={currency.id} value={currency.id}>
                  {currency.symbol}
                </option>
              ))}
            </select>
            {formik.touched.currency && formik.errors.currency && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.currency}
              </p>
            )}
          </div>

          {/* Leverage Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leverage <span className="text-red-500">*</span>
            </label>
            <select
              name="leverage"
              value={formik.values.leverage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Leverage</option>
              {options?.data?.leverages?.map((leverages: any) => (
                <option key={leverages.id} value={leverages.value}>
                  {leverages.show_value}
                </option>
              ))}
            </select>
            {formik.touched.leverage && formik.errors.leverage && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.leverage}
              </p>
            )}
          </div>

          {/* Investor Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investor Password <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="investorPassword"
                value={formik.values.investorPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Auto-generated password"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  formik.setFieldValue(
                    "investorPassword",
                    generateRandomPassword()
                  )
                }
              >
                Generate
              </Button>
            </div>
            {formik.touched.investorPassword &&
              formik.errors.investorPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.investorPassword}
                </p>
              )}
          </div>

          {/* Master Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Master Password <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="masterPassword"
                value={formik.values.masterPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Auto-generated password"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  formik.setFieldValue(
                    "masterPassword",
                    generateRandomPassword()
                  )
                }
              >
                Generate
              </Button>
            </div>
            {formik.touched.masterPassword && formik.errors.masterPassword && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.masterPassword}
              </p>
            )}
          </div>

         

          {/* Terms and Conditions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Important Information:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Demo accounts come with $10,000 virtual money</li>
              <li>• Live accounts require a minimum deposit of $100</li>
              <li>• Leverage increases both potential profits and losses</li>
              <li>• You can modify account settings after creation</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => formik.resetForm()}
            >
              Reset
            </Button>
           
            <Button type="submit" disabled={isSubmitting || !formik.isValid}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TradingAccountCreation;
