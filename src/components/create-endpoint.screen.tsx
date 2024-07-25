import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEndpointForm: React.FC = () => {
  const [authMethod, setAuthMethod] = useState("");
  const [authValues, setAuthValues] = useState({
    useName: "",
    password: "",
    tokenValue: "",
    basicAuthToken: "",
  });
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
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: checked,
    });
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

  const handleSubmit = async () => {
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
        toast.success(response.data.message);
        // setEndpointUid(response.data.data.uid);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create endpoint");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Convoy Configuration Form</h2>
      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700">Convoy URL</label>
          <input
            type="text"
            name="convoyUrl"
            value={formValues.convoyUrl}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="http://103.20.214.75:5005"
          />
        </div>
        <div>
          <label className="block text-gray-700">
            Rate Limit Duration (in seconds)
          </label>
          <input
            type="text"
            name="rateLimitDuration"
            value={formValues.rateLimitDuration}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Rate Limit Duration"
          />
        </div>
        <div>
          <label className="block text-gray-700">Webhook URL</label>
          <input
            type="text"
            name="webhookUrl"
            value={formValues.webhookUrl}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Webhook URL"
          />
        </div>
        <div>
          <label className="block text-gray-700">Owner ID</label>
          <input
            type="text"
            name="ownerId"
            value={formValues.ownerId}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="01J3A1HF8GWDJF0Z1XQGDKN8FE"
          />
        </div>
        <div>
          <label className="block text-gray-700">Support Email</label>
          <input
            type="email"
            name="supportEmail"
            value={formValues.supportEmail}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Support Email"
          />
        </div>
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Name"
          />
        </div>
        <div>
          <label className="block text-gray-700">Project ID</label>
          <input
            type="text"
            name="projectId"
            value={formValues.projectId}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Project ID"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Authentication
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
              <input
                type="password"
                name="password"
                value={authValues.password || ""}
                onChange={handleAuthValueChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Password"
                aria-label="Password"
              />
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
          <label className="block text-gray-700">API Key</label>
          <input
            type="text"
            name="apiKey"
            value={formValues.apiKey}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="API Key"
          />
        </div>
        <div>
          <label className="block text-gray-700">Rate Limit</label>
          <input
            type="text"
            name="rateLimit"
            value={formValues.rateLimit}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Rate Limit"
          />
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
