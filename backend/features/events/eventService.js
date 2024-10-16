const eventRepository = require("./eventRepository");
const CustomError = require("../../utils/CustomError");

exports.getAllEvents = async (societyId) => {
  return await eventRepository.getAllEvents(societyId);
};

exports.createEvent = async (eventData) => {
  const newEvent =  await eventRepository.createEvent(eventData);
  console.log("new event",newEvent);
  return newEvent
  
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
