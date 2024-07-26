import React from "react";
import Tabs from "./Tabs/tabs";
import ReduxToastr from "react-redux-toastr";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="w-full p-6">
        <ReduxToastr
          timeOut={5000}
          newestOnTop={true}
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
          closeOnToastrClick
        />
        <Tabs />
      </main>
    </div>
  );
};

export default App;
