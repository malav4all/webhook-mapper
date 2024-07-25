import React, { useState } from "react";
import CreateEndpointForm from "../components/create-endpoint.screen";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("create-endpoint");

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
        {activeTab === "create-endpoint" && <CreateEndpointForm />}
        {/* {activeTab === "mapper" && <MapperScreen />} */}
      </div>
    </div>
  );
};

export default Tabs;
