import React from "react";
import { X } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../../components/ui/Button";
import { ADMIN_ADD_NEW_CLIENT } from "../../../../api/api-variable";
import { apiRequest } from "@/services";
import { enqueueSnackbar } from "notistack";
import useAdminAuth from "@/Hook/useAdminAuth";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ClientFormValues {
  sponsor_email: string;
  first_name: string;
  last_name: string;
  client_email: string;
  client_password: string;
  client_confirm_password: string;
  client_country: string;
  client_phone: string;
}

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string(),
  client_email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  client_password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  client_confirm_password: Yup.string()
    .oneOf([Yup.ref("client_password")], "Passwords must match")
    .required("Confirm password is required"),
  client_phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  sponsor_email: Yup.string().email("Invalid email address"),
  client_country: Yup.string().required("Country code is required"),
});


const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
    
  const { adminToken } = useAdminAuth();

  if (!isOpen) return null;
  

  const initialValues: ClientFormValues = {
    sponsor_email: "",
    first_name: "",
    last_name: "",
    client_email: "",
    client_password: "",
    client_confirm_password: "",
    client_country: "+91",
    client_phone: "",
  };

  const handleSubmit = (values: ClientFormValues) => {
    console.log("Add client request:", values);

    try {
      apiRequest({
        endpoint: ADMIN_ADD_NEW_CLIENT,
        method: "POST",
        data: values,
            headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((response: unknown) => {
          console.log("Add client response:", response);

          const responseData = response as {
            success?: boolean;
            message?: string;
          };
          if (responseData.success === false) {
            enqueueSnackbar(responseData.message || "Failed to add client!", {
              variant: "error",
            });
          } else {
            enqueueSnackbar(
              responseData.message || "Client added successfully!",
              { variant: "success" }
            );
            if (onSuccess) {
              onSuccess();
            }
          }
        })
        .catch((error) => {
          console.error("Error adding client:", error);
          const errorMessage =
            error?.response?.data?.message || "Failed to add client";
          enqueueSnackbar(errorMessage, { variant: "error" });
        });
    } catch (error) {
      console.error("Failed to submit values:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add client";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Client Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-6">
                {/* Sponsor Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor Email
                  </label>
                  <Field
                    type="email"
                    name="sponsor_email"
                    placeholder="Enter sponsor email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="sponsor_email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="first_name"
                    placeholder="Enter first name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    name="last_name"
                    placeholder="Enter last name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    name="client_email"
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="client_email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="password"
                    name="client_password"
                    placeholder="Enter password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="client_password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="password"
                    name="client_confirm_password"
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="client_confirm_password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Country and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="client_country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="+91">IN (+91)</option>
                      <option value="+1">US (+1)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+971">UAE (+971)</option>
                      <option value="+61">AU (+61)</option>
                      <option value="+81">JP (+81)</option>
                      <option value="+86">CN (+86)</option>
                    </Field>
                    <ErrorMessage
                      name="client_country"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="tel"
                      name="client_phone"
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <ErrorMessage
                      name="client_phone"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="px-6"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-6 bg-green-600 hover:bg-green-700"
                  >
                    Create
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
