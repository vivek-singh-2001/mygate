const eventRepository = require('./eventRepository');
const CustomError = require('../../utils/CustomError');
 
const eventService = {
  getAllEvents: async () => {
    return await eventRepository.getAllEvents();
  },

  createEvent: async (eventData, userRole) => {
    // Only admins can create events
    if (userRole !== 'admin') {
      throw new CustomError('Only admins can create events', 403);
    }
    return await eventRepository.createEvent(eventData);
  },

  updateEvent: async (id, eventData, userRole) => {
    if (userRole !== 'admin') {
      throw new CustomError('Only admins can update events', 403);
    }
    return await eventRepository.updateEvent(id, eventData);
  },

  deleteEvent: async (id, userRole) => {
    if (userRole !== 'admin') {
      throw new CustomError('Only admins can delete events', 403);
    }
    return await eventRepository.deleteEvent(id);
  },
};

module.exports = eventService;
