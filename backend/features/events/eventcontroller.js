const eventService = require('./eventService');

const eventController = {
  getAllEvents: async (req, res, next) => {
    try {
      const events = await eventService.getAllEvents();
      res.json(events);
    } catch (error) {
      next(error);
    }
  },

  createEvent: async (req, res, next) => {
    try {
      const eventData = req.body;
      console.log(eventData);
      
      // const userRole = req.user.role;  
      const newEvent = await eventService.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      next(error);
    }
  },

  updateEvent: async (req, res, next) => {
    try {
      const { id } = req.params;
      const eventData = req.body;
      const userRole = req.user.role;
      const updatedEvent = await eventService.updateEvent(id, eventData, userRole);
      res.json(updatedEvent);
    } catch (error) {
      next(error);
    }
  },

  deleteEvent: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userRole = req.user.role;
      await eventService.deleteEvent(id, userRole);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = eventController;
