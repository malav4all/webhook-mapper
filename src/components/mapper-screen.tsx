import React, { useEffect, useState } from "react";
import { validateMapperForm } from "./formValidation/convoyValidation";
import { collectionOptions, Track, Trip } from "./helper/formFieldsConfig";
import { RiDeleteBin6Line } from "react-icons/ri";
import Toast from "./toast";

const MapperScreen: React.FC<{
  mapperValues: { projectId: string; apiKey: string; endpointId: string };
}> = ({ mapperValues }) => {
  const [formValues, setFormValues] = useState({
    projectId: "",
    apiKey: "",
    endpointId: "",
    accountId: "",
    collectionName: "",
    pushData: "allTimes",
    wrapper: "",
  });
  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      projectId: mapperValues.projectId,
      apiKey: mapperValues.apiKey,
      endpointId: mapperValues.endpointId,
    }));
  }, [mapperValues]);
  const [checkedFields, setCheckedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [fixedFieldValues, setFixedFieldValues] = useState<{
    [key: string]: string;
  }>({});

  const [savedAddOnFields, setSavedAddOnFields] = useState<{
    [key: string]: string;
  }>({});
  const [newFields, setNewFields] = useState<string[]>([""]);
  const [addOnFieldValues, setAddOnFieldValues] = useState<{
    [key: string]: string;
  }>({});
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [`mapper${name.charAt(0).toUpperCase() + name.slice(1)}`]: "",
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [`mapper${name.charAt(0).toUpperCase() + name.slice(1)}`]: "",
    }));
  };

  const handleCheckboxChange = (field: string) => {
    setCheckedFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleFixedFieldChange = (field: string, value: string) => {
    setFixedFieldValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleAddOnFieldChange = (
    index: number,
    type: number,
    value: string
  ) => {
    const keyField = `addOnField${index + 1}-1`;
    const valueField = `addOnField${index + 1}-2`;

    setAddOnFieldValues((prevState) => ({
      ...prevState,
      [type === 0 ? keyField : valueField]: value,
    }));
  };

  const handleSaveAddOnField = (index: number) => {
    const keyField = `addOnField${index + 1}-1`;
    const valueField = `addOnField${index + 1}-2`;

    if (addOnFieldValues[keyField] && addOnFieldValues[valueField]) {
      setSavedAddOnFields((prevState) => ({
        ...prevState,
        [addOnFieldValues[keyField]]: addOnFieldValues[valueField],
      }));
      setAddOnFieldValues((prevState) => {
        const newValues = { ...prevState };
        delete newValues[keyField];
        delete newValues[valueField];
        return newValues;
      });
      setNewFields((prevState) => prevState.filter((_, i) => i !== index));
    }
  };

  const handleDeleteAddOnField = (key: string) => {
    setSavedAddOnFields((prevState) => {
      const newFields = { ...prevState };
      delete newFields[key];
      return newFields;
    });
  };

  const handleAddNewField = () => {
    setNewFields((prevState) => [...prevState, ""]);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      pushData: e.target.value,
    }));
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      pushData: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateMapperForm(formValues);
    setErrors(errors);
    if (!isValid) {
      return;
    }

    const accountIdArray = formValues.accountId
      .split(",")
      .map((id) => id.trim());

    const tripDataMapper: {
      [key: string]: { enabled: boolean; newKey: string };
    } = {};

    const trackDataMapper: {
      [key: string]: { enabled: boolean; newKey: string };
    } = {};

    const addOnField: {
      [key: string]: { enabled: boolean; newKey: string };
    } = {};

    for (const key in savedAddOnFields) {
      if (savedAddOnFields.hasOwnProperty(key)) {
        addOnField[key] = {
          enabled: true,
          newKey: savedAddOnFields[key],
        };
      }
    }

    for (const key in Track) {
      if (Track.hasOwnProperty(key)) {
        trackDataMapper[key] = {
          enabled: !!checkedFields[key],
          newKey: checkedFields[key]
            ? fixedFieldValues[key] || Track[key]
            : key,
        };
      }
    }

    for (const key in Trip) {
      if (Trip.hasOwnProperty(key)) {
        tripDataMapper[key] = {
          enabled: !!checkedFields[key],
          newKey: checkedFields[key] ? fixedFieldValues[key] || Trip[key] : key,
        };
      }
    }

    const payload = {
      account: accountIdArray,
      collectionName: formValues.collectionName,
      convoyProjectId: formValues.projectId,
      convoyEndpointId: formValues.endpointId,
      pushData: formValues.pushData,
      tripDataMapper: tripDataMapper,
      trackDataMapper: trackDataMapper, // assuming you will populate this similarly to tripDataMapper
      addOnFields: addOnField, // assuming you will populate this similarly to tripDataAddOnFields
    };

    try {
      const response = await fetch(
        "http://localhost:5500/api/v1.0/saveDataFeed",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      Toast.success({
        message: result.message,
      });
      // console.log("API Response:", result);
    } catch (error) {
      Toast.error({
        message: error,
      });
    }
    // Handle form submission logic, such as making an API call with the payload
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mapper Screen</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700">
              Convoy Project ID<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="projectId"
              value={formValues.projectId}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Project ID"
            />
            {errors.mapperProjectId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mapperProjectId}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">
              Convoy API Key<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="apiKey"
              value={formValues.apiKey}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="API Key"
            />
            {errors.mapperApiKey && (
              <p className="text-red-500 text-xs mt-1">{errors.mapperApiKey}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">
              Convoy Endpoint ID<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="endpointId"
              value={formValues.endpointId}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Endpoint ID"
            />
            {errors.mapperEndpointId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mapperEndpointId}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">
              Account ID<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountId"
              value={formValues.accountId}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Account ID (comma separated)"
            />
            {errors.mapperAccountId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mapperAccountId}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-gray-700">
              Collection Name<span className="text-red-500">*</span>
            </label>
            <select
              name="collectionName"
              value={formValues.collectionName}
              onChange={handleSelectChange}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Select Collection</option>
              {collectionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.mapperCollectionName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mapperCollectionName}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">
              Wrapper<span className="text-red-500">*</span>
            </label>
            <select
              name="wrapper"
              value={formValues.wrapper}
              onChange={handleSelectChange}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Select Collection</option>
              {["array", "object"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.mapperWrapper && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mapperWrapper}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block text-gray-700">
              Push Data<span className="text-red-500">*</span>
            </label>
            <div className="flex mt-1">
              <label className="mr-4 flex items-center">
                <input
                  type="radio"
                  name="pushData"
                  value="allTimes"
                  checked={formValues.pushData === "allTimes"}
                  onChange={handleRadioChange}
                  className="mr-1"
                />
                All Times
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pushData"
                  value="duringTrip"
                  checked={formValues.pushData === "duringTrip"}
                  onChange={handleRadioChange}
                  className="mr-1"
                />
                During Trip
              </label>
            </div>
            {errors.mapperPushData && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mapperPushData}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: "500px" }}
          >
            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Map Fixed Fields (Track)
              </label>
              <div className="grid grid-cols-12 gap-4">
                {Object.keys(Track).map((field) => (
                  <div key={field} className="col-span-12 flex items-center">
                    <input
                      type="checkbox"
                      id={field}
                      className="mr-2"
                      onChange={() => handleCheckboxChange(field)}
                    />
                    <label
                      htmlFor={field}
                      className="text-gray-700 text-left text-sm w-1/3"
                    >
                      {field}
                    </label>
                    <input
                      type="text"
                      className="w-2/3 block py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder={`Enter new key for ${field}`}
                      disabled={!checkedFields[field]}
                      onChange={(e) =>
                        handleFixedFieldChange(field, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: "500px" }}
          >
            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Map Fixed Fields (Trip)
              </label>
              <div className="grid grid-cols-12 gap-4">
                {Object.keys(Trip).map((field) => (
                  <div key={field} className="col-span-12 flex items-center">
                    <input
                      type="checkbox"
                      id={field}
                      className="mr-2"
                      onChange={() => handleCheckboxChange(field)}
                    />
                    <label
                      htmlFor={field}
                      className="text-gray-700 text-left text-sm w-1/3"
                    >
                      {field}
                    </label>
                    <input
                      type="text"
                      className="w-2/3 block py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder={`Enter new key for ${field}`}
                      disabled={!checkedFields[field]}
                      onChange={(e) =>
                        handleFixedFieldChange(field, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: "500px" }}
          >
            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Add-On Fields
              </label>
              <div className="grid grid-cols-12 gap-4">
                {Object.keys(savedAddOnFields).map((key) => (
                  <div
                    key={key}
                    className="col-span-12 flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={key}
                      readOnly
                      className="block w-1/2 py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <input
                      type="text"
                      value={savedAddOnFields[key]}
                      readOnly
                      className="block w-1/2 py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteAddOnField(key)}
                      className="inline-flex justify-center py-2 text-md px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                ))}
                {newFields.map((field, index) => {
                  const keyField = `addOnField${index + 1}-1`;
                  const valueField = `addOnField${index + 1}-2`;
                  return (
                    <div
                      key={index}
                      className="col-span-12 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        value={addOnFieldValues[keyField] || ""}
                        className="block w-1/2 py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Key"
                        onChange={(e) =>
                          handleAddOnFieldChange(index, 0, e.target.value)
                        }
                      />
                      <input
                        type="text"
                        value={addOnFieldValues[valueField] || ""}
                        className="block w-1/2 py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Value"
                        onChange={(e) =>
                          handleAddOnFieldChange(index, 1, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveAddOnField(index)}
                        className="inline-flex justify-center py-1 px-3 text-sm border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleAddNewField}
                className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add New Field
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            type="submit"
            className="mt-4 text-center bg-blue-500 text-white p-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default MapperScreen;
