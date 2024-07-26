import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validateConvoyForm } from "./formValidation/convoyValidation";
import Toast from "./toast";

const CreateEndpointForm: React.FC<{
  onSuccess: (data: {
    projectId: string;
    apiKey: string;
    endpointId: string;
  }) => void;
}> = ({ onSuccess }) => {
  const [authMethod, setAuthMethod] = useState("");
  const [authValues, setAuthValues] = useState({
    useName: "",
    password: "",
    tokenValue: "",
    basicAuthToken: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [generatedToken, setGeneratedToken] = useState("");
  const [formValues, setFormValues] = useState({
    convoyUrl: "https://convoy.imztech.io",
    rateLimitDuration: "",
    webhookUrl: "",
    ownerId: "01J3K07Y3NC9VR5W7A3HYFKPJM",
    supportEmail: "",
    name: "",
    projectId: "01J3K08ESQ1SJC08RY9PY87KQJ",
    disabled: false,
    secret: "",
    apiKey: "",
    rateLimit: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: checked,
    }));
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAuthMethod(e.target.value);
    setAuthValues({
      useName: "",
      password: "",
      tokenValue: "",
      basicAuthToken: "",
    }); // Reset auth values on change
    setGeneratedToken("");
    setFormValues({ ...formValues, secret: "" });
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      authMethod: "",
      secret: "",
    }));
  };

  const handleAuthValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthValues((prevState) => {
      const updatedValues = {
        ...prevState,
        [name]: value,
      };

      if (
        authMethod === "BasicAuth" &&
        updatedValues.useName &&
        updatedValues.password
      ) {
        const token = btoa(
          `${updatedValues.useName}:${updatedValues.password}`
        );
        updatedValues.basicAuthToken = `Basic ${token}`;
        setGeneratedToken(updatedValues.basicAuthToken);
        setFormValues((prevValues) => ({
          ...prevValues,
          secret: updatedValues.basicAuthToken,
        }));
      } else if (authMethod === "Bearer") {
        setFormValues((prevValues) => ({
          ...prevValues,
          secret: value,
        }));
      }

      return updatedValues;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateConvoyForm(formValues, authMethod);
    setErrors(errors);
    if (!isValid) {
      return;
    }
    const payload = {
      advanced_signatures: true,
      appID: formValues.projectId, // Using the projectId from form values
      authentication: {
        api_key: {
          header_name: "Authorization",
          header_value: `Bearer ${formValues.apiKey}`,
        },
        type: "api_key",
      },
      description: "this",
      http_timeout: 10,
      is_disabled: formValues.disabled,
      name: formValues.name,
      owner_id: formValues.ownerId,
      rate_limit: Number(formValues.rateLimit),
      rate_limit_duration: Number(formValues.rateLimitDuration),
      secret: formValues.secret,
      slack_webhook_url: "",
      support_email: formValues.supportEmail,
      url: formValues.webhookUrl, // Using the webhookUrl from form values
    };

    try {
      const response = await axios.post(
        `https://convoy.imztech.io/api/v1/projects/${formValues.projectId}/endpoints`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${formValues.apiKey}`,
          },
        }
      );
      if (response.data.status) {
        Toast.success({
          message: response.data.message,
        });
        // Toast.success(response.data.message);
        const responseData = response.data.data;
        const apiKey = responseData.authentication.api_key.header_value.replace(
          "Bearer ",
          ""
        );
        onSuccess({
          projectId: responseData.project_id,
          apiKey: apiKey,
          endpointId: responseData.uid,
        });
      }
    } catch (error) {
      Toast.error({
        message: error,
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Convoy Configuration Form</h2>
      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700">
            Convoy URL<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="convoyUrl"
            value={formValues.convoyUrl}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="http://103.20.214.75:5005"
          />
          {errors.convoyUrl && (
            <p className="text-red-500 text-xs mt-1">{errors.convoyUrl}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">
            Rate Limit Duration (in seconds)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="rateLimitDuration"
            value={formValues.rateLimitDuration}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Rate Limit Duration"
          />
          {errors.rateLimitDuration && (
            <p className="text-red-500 text-xs mt-1">
              {errors.rateLimitDuration}
            </p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">
            Webhook URL<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="webhookUrl"
            value={formValues.webhookUrl}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Webhook URL"
          />
          {errors.webhookUrl && (
            <p className="text-red-500 text-xs mt-1">{errors.webhookUrl}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">
            Owner ID<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ownerId"
            value={formValues.ownerId}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="01J3A1HF8GWDJF0Z1XQGDKN8FE"
          />
          {errors.ownerId && (
            <p className="text-red-500 text-xs mt-1">{errors.ownerId}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">
            Support Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="supportEmail"
            value={formValues.supportEmail}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Support Email"
          />
          {errors.supportEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.supportEmail}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">
            Project ID<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="projectId"
            value={formValues.projectId}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Project ID"
          />
          {errors.projectId && (
            <p className="text-red-500 text-xs mt-1">{errors.projectId}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Authentication<span className="text-red-500">*</span>
          </label>
          <select
            id="authMethod"
            name="authMethod"
            value={authMethod}
            onChange={handleAuthChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Authentication</option>
            <option value="BasicAuth">Basic Auth</option>
            <option value="Bearer">Token</option>
          </select>
          {errors.authMethod && (
            <p className="text-red-500 text-xs mt-1">{errors.authMethod}</p>
          )}
          {authMethod === "BasicAuth" && (
            <div className="mt-4 space-y-4">
              <input
                type="text"
                name="useName"
                value={authValues.useName || ""}
                onChange={handleAuthValueChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Username"
                aria-label="Username"
              />
              {errors.secret && !authValues.useName && (
                <p className="text-red-500 text-xs mt-1">{errors.secret}</p>
              )}
              <input
                type="password"
                name="password"
                value={authValues.password || ""}
                onChange={handleAuthValueChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Password"
                aria-label="Password"
              />
              {errors.secret && !authValues.password && (
                <p className="text-red-500 text-xs mt-1">{errors.secret}</p>
              )}
            </div>
          )}
          {authMethod === "Bearer" && (
            <div className="mt-4">
              <input
                type="text"
                name="tokenValue"
                value={authValues.tokenValue || ""}
                onChange={handleAuthValueChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Token"
                aria-label="Token"
              />
              {errors.secret && !authValues.tokenValue && (
                <p className="text-red-500 text-xs mt-1">{errors.secret}</p>
              )}
              {generatedToken && (
                <div className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm">
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Generated Token
                  </label>
                  <p className="break-all">{generatedToken}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Disabled</label>
          <input
            type="checkbox"
            name="disabled"
            checked={formValues.disabled}
            onChange={handleCheckboxChange}
            className="mt-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Secret</label>
          <input
            type="text"
            name="secret"
            value={formValues.secret}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Secret"
          />
        </div>
        <div>
          <label className="block text-gray-700">
            API Key<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="apiKey"
            value={formValues.apiKey}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="API Key"
          />
          {errors.apiKey && (
            <p className="text-red-500 text-xs mt-1">{errors.apiKey}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">
            Rate Limit<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="rateLimit"
            value={formValues.rateLimit}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Rate Limit"
          />
          {errors.rateLimit && (
            <p className="text-red-500 text-xs mt-1">{errors.rateLimit}</p>
          )}
        </div>
      </form>
      <div className="flex justify-center">
        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-4 text-center bg-blue-500 text-white p-2 rounded"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default CreateEndpointForm;
