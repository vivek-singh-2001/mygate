
const express = require('express');
const staffController = require('./staffController');

const router = express.Router();

router.post('/createStaff', staffController.createStaff);

router.get('/getAllStaff/:societyId', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
