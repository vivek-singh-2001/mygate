const { db } = require("../../config/connection");
const { Event } = db;

exports.getAllEvents = async (societyId) => {
  return await Event.findAll({
    where: {
      societyId
    }
  });
};

exports.getEventById = async (id) => {
  return await Event.findByPk(id);
};

exports.createEvent = (eventData) => {
  
  const newEvent =  Event.create({
    title:eventData.title,
    description:eventData.description,
    start_date:eventData.start_date,
    societyId:eventData.SocietyId
  });

  return newEvent
};

exports.updateEvent = (id, eventData) => {
  return Event.update(eventData, { where: { id } });
};

exports.deleteEvent = (id) => {
  return Event.destroy({ where: { id } });
};
