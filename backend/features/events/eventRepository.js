const { where } = require("sequelize");
const { db } = require("../../config/connection");
const { Event } = db;

exports.getAllEvents = async (societyId) => {
  return await Event.findAll({
    where: {
      SocietyId: societyId
    }
  });
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
