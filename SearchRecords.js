
import React, { useState } from "react";
import axios from "axios";
import EditRecord from "../EditRecord";


const SearchRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/records?query=${searchQuery}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
  };

  return (
    <div>
      <h2>Search Pricing Records</h2>
      <input
        type="text"
        placeholder="Search by Store ID, SKU, etc."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {results.map((record) => (
          <div key={record.id}>
            <p>
              {record.storeId} | {record.sku} | {record.productName} | $
              {record.price} | {record.date}
            </p>
            <button onClick={() => handleEdit(record)}>Edit</button>
          </div>
        ))}
      </div>
      {selectedRecord && (
        <EditRecord record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
};

export default SearchRecords;
