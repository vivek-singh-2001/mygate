const eventRepository = require("./eventRepository");
const CustomError = require("../../utils/CustomError");

exports.getAllEvents = async (eventId) => {
  return await eventRepository.getAllEvents(eventId);
};

exports.createEvent = async (eventData) => {
  return await eventRepository.createEvent(eventData);
};

exports.updateEvent = async (id, eventData, userRole) => {
  if (userRole !== "admin") {
    throw new CustomError("Only admins can update events", 403);
  }
  return await eventRepository.updateEvent(id, eventData);
};

exports.deleteEvent = async (id, userRole) => {
  if (userRole !== "admin") {
    throw new CustomError("Only admins can delete events", 403);
  }
  return await eventRepository.deleteEvent(id);
};
