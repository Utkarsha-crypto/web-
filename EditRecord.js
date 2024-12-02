
// File: src/components/EditRecord.js
import React, { useState } from "react";
import axios from "axios";

const EditRecord = ({ record, onClose }) => {
  const [updatedRecord, setUpdatedRecord] = useState({ ...record });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/records/${record.id}`, updatedRecord);
      alert("Record updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <div>
      <h2>Edit Record</h2>
      <input
        type="text"
        name="price"
        value={updatedRecord.price}
        onChange={handleChange}
      />
      <input
        type="text"
        name="productName"
        value={updatedRecord.productName}
        onChange={handleChange}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditRecord;
