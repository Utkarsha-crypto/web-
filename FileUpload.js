import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message || "File uploaded successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error uploading file.";
      setMessage(errorMsg);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setMessage("");
  };

  return (
    <div>
      <h2>Upload Pricing Feed</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {file && (
        <div>
          <p>Selected File: {file.name}</p>
          <button onClick={handleRemoveFile}>Remove File</button>
        </div>
      )}
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
