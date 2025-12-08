const express = require('express');
const router = express.Router();
const { listTransactions, getOptions } = require('../controllers/transactionController');

//Returns unique Regions, Categories, etc. for the frontend dropdowns.
router.get('/options', getOptions);

//Handles Search, Filtering, Sorting, and Pagination via query parameters.
router.get('/', listTransactions);

module.exports = router;