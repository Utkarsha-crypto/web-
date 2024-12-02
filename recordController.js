const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const db = require('../models/db');

// Multer setup for file upload
const upload = multer({ dest: './uploads/' });

// Handle file upload and parse CSV
const uploadCSV = (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const results = [];
  fs.createReadStream(file.path)
    .pipe(csvParser())
    .on('data', (data) => {
      const { StoreID, SKU, ProductName, Price, Date } = data;

      // Basic validation
      if (!StoreID || !SKU || !ProductName || !Price || !Date) {
        return res.status(400).send('Invalid CSV format.');
      }

      results.push({
        storeId: StoreID,
        sku: SKU,
        productName: ProductName,
        price: parseFloat(Price),
        date: Date,
      });
    })
    .on('end', () => {
      // Insert records into the database
      const stmt = db.prepare(`
        INSERT INTO pricing (storeId, sku, productName, price, date)
        VALUES (?, ?, ?, ?, ?)
      `);

      results.forEach((record) => {
        stmt.run(record.storeId, record.sku, record.productName, record.price, record.date);
      });

      stmt.finalize();
      fs.unlinkSync(file.path); // Remove the uploaded file
      res.status(200).send('File processed successfully.');
    });
};

// Fetch records with optional search criteria
const getRecords = (req, res) => {
  const { query } = req.query;
  const sql = query
    ? `SELECT * FROM pricing WHERE storeId LIKE ? OR sku LIKE ? OR productName LIKE ?`
    : `SELECT * FROM pricing`;

  const params = query ? [`%${query}%`, `%${query}%`, `%${query}%`] : [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching records.');
    }
    res.status(200).json(rows);
  });
};

// Update a record by ID
const updateRecord = (req, res) => {
  const { id } = req.params;
  const { storeId, sku, productName, price, date } = req.body;

  if (!storeId || !sku || !productName || !price || !date) {
    return res.status(400).send('All fields are required.');
  }

  const sql = `
    UPDATE pricing SET storeId = ?, sku = ?, productName = ?, price = ?, date = ?
    WHERE id = ?
  `;
  const params = [storeId, sku, productName, price, date, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).send('Error updating record.');
    }
    if (this.changes === 0) {
      return res.status(404).send('Record not found.');
    }
    res.status(200).send('Record updated successfully.');
  });
};

module.exports = {
  upload,
  uploadCSV,
  getRecords,
  updateRecord,
};
