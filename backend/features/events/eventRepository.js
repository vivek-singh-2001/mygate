const { db } = require("../../config/connection");
const { Event } = db;

exports.getAllEvents = async (eventId) => {
  return await Event.findAll();
};

exports.getEventById = async (id) => {
  return await Event.findByPk(id);
};

exports.createEvent = (eventData) => {
  return Event.create(eventData);
};

exports.updateEvent = (id, eventData) => {
  return Event.update(eventData, { where: { id } });
};

exports.deleteEvent = (id) => {
  return Event.destroy({ where: { id } });
};
