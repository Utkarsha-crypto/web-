const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

// File upload and processing
router.post('/upload', recordController.upload.single('file'), recordController.uploadCSV);

// Get records with optional search
router.get('/records', recordController.getRecords);

// Update a record by ID
router.put('/records/:id', recordController.updateRecord);

module.exports = router;
