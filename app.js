
import React from "react";
import FileUpload from "./components/FileUpload";
import SearchRecords from './components/SearchRecords';


const App = () => {
  return (
    <div>
      <h1>Retail Store Pricing Management</h1>
      <FileUpload />
      <SearchRecords />
    </div>
  );
};

export default App;
