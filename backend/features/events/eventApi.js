const express = require('express');
const router = express.Router();
const eventController = require('./eventcontroller');

// Routes to manage events
router.get('/:id',  eventController.getAllEvents);
router.post('/',eventController.createEvent);
router.put('/:id', eventController.updateEvent);    
router.delete('/:id', eventController.deleteEvent); 
module.exports = router;
