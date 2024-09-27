const { param, validationResult } = require("express-validator");
const eventService = require("./eventService");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");

exports.getAllEvents = asyncErrorHandler(async (req, res) => {
  const { id: societyId } = req.params;
  const events = await eventService.getAllEvents(societyId);
  res.json(events);
});

exports.createEvent = asyncErrorHandler(async (req, res) => {
  const eventData = req.body;
  console.log(eventData);
  const newEvent = await eventService.createEvent(eventData);
  res.status(201).json(newEvent);
});

exports.updateEvent = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const eventData = req.body;
  const userRole = req.user.role;
  const updatedEvent = await eventService.updateEvent(id, eventData, userRole);
  res.json(updatedEvent);
});

exports.deleteEvent = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const userRole = req.user.role;
  await eventService.deleteEvent(id, userRole);
  res.status(204).send();
});
