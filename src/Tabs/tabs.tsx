import React, { useState } from "react";
import CreateEndpointForm from "../components/create-endpoint.screen";
import MapperScreen from "../components/mapper-screen";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("create-endpoint");
  const [mapperValues, setMapperValues] = useState({
    projectId: "",
    apiKey: "",
    endpointId: "",
  });
  const switchToMapperTab = (data: {
    projectId: string;
    apiKey: string;
    endpointId: string;
  }) => {
    setMapperValues(data);
    setActiveTab("mapper");
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("create-endpoint")}
          className={`px-4 py-2 rounded ${
            activeTab === "create-endpoint"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Create Endpoint
        </button>
        <button
          onClick={() => setActiveTab("mapper")}
          className={`px-4 py-2 rounded ${
            activeTab === "mapper" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Mapper
        </button>
      </div>

      <div>
        {activeTab === "create-endpoint" && (
          <CreateEndpointForm onSuccess={switchToMapperTab} />
        )}
        {activeTab === "mapper" && <MapperScreen mapperValues={mapperValues} />}
      </div>
    </div>
  );
};

export default Tabs;
