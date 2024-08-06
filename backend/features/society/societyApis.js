const express = require('express');
const societyController = require('./societyController');

const router = express.Router();

// Define routes
router.get('/:societyId', societyController.getUsersBySociety);
router.get('/:societyId/wing/:wingName', societyController.getUsersBySocietyAndWing);

module.exports = router;