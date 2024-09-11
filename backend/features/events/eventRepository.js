const {db} = require('../../config/connection');
const {Event} = db

const eventRepository = {
  // Fetch all events
  getAllEvents: async() => {
    return await Event.findAll();
  },

  // Fetch a specific event by ID
  getEventById: async(id) => {
    return await Event.findByPk(id);
  },

  // Create a new event
  createEvent:  (eventData) => {
    return  Event.create(eventData);
  },

  // Update an event
  updateEvent: (id, eventData) => {
    return Event.update(eventData, { where: { id } });
  },

  // Delete an event
  deleteEvent: (id) => {
    return Event.destroy({ where: { id } });
  },
};

module.exports = eventRepository;
