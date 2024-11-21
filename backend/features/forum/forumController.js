const forumService = require("./forumService");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/CustomError");
const { log } = require("util");

exports.createForum = asyncErrorHandler(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return next(new CustomError("Name and description are required.", 400));
  }

  const forum = await forumService.createForum({ name, description });
  res.status(201).json({ status: "success", data: forum });
});

exports.getAllForums = asyncErrorHandler(async (req, res, next) => {
    const societyId = req.params.id
    console.log(societyId);
    
  const forums = await forumService.getAllForums(societyId);
  res.status(200).json({ status: "success", data: forums });
});

exports.getForumById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const forum = await forumService.getForumById(id);

  if (!forum) {
    return next(new CustomError(`Forum with ID ${id} not found.`, 404));
  }

  res.status(200).json({ status: "success", data: forum });
});

exports.updateForum = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedForum = await forumService.updateForum(id, updates);

  if (!updatedForum) {
    return next(new CustomError(`Forum with ID ${id} not found.`, 404));
  }

  res.status(200).json({ status: "success", data: updatedForum });
});

exports.deleteForum = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const deleted = await forumService.deleteForum(id);

  if (!deleted) {
    return next(new CustomError(`Forum with ID ${id} not found.`, 404));
  }

  res.status(204).json({ status: "success", message: "Forum deleted." });
});
