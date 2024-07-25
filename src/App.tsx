import React from "react";
import Tabs from "./Tabs/tabs";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="w-full p-6">
        <Tabs />
      </main>
    </div>
  );
};

export default App;
