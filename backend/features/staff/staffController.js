
const staffService = require('./staffService');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const CustomError = require('../../utils/CustomError');

exports.createStaff = asyncErrorHandler(async (req, res, next) => {
  const staffData = req.body;

  console.log(staffData.societyId);
  

  const newStaff = await staffService.createStaff(staffData,next);
  res.status(201).json({ status: 'success', data: newStaff });
});

exports.getAllStaff = asyncErrorHandler(async (req, res, next) => {
  const {societyId} = req.params;
  
  const staffList = await staffService.getAllStaff(societyId);
  if(!staffList){
    return next(new CustomError("staff list doesnt found"))
  }
  res.status(200).json({ status: 'success', data: staffList });
});

exports.getStaffById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const staff = await staffService.getStaffById(id);

  if (!staff) {
    return next(new CustomError('Staff not found', 404));
  }

  res.status(200).json({ status: 'success', data: staff });
});

exports.updateStaff = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedStaff = await staffService.updateStaff(id, updatedData);

  if (!updatedStaff[0]) {
    return next(new CustomError('Failed to update staff', 400));
  }

  res.status(200).json({ status: 'success', message: 'Staff updated successfully' });
});

exports.deleteStaff = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  await staffService.deleteStaff(id);
  res.status(204).json({ status: 'success', message: 'Staff deleted successfully' });
});
