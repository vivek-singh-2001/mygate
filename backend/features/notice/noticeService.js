// services/NoticeService.js
const NoticeRepository = require('./noticeRepository');

const NoticeService = {
  createNotice: async (noticeData,images) => {
    return await NoticeRepository.createNotice(noticeData,images);
  },

  getAllNotice: async (societyId) => {
    return await NoticeRepository.getAllNotice(societyId);
  },

  getNoticeById: async (id) => {
    return await NoticeRepository.getNoticeById(id);
  },

  updateNotice: async (id, updatedData) => {
    return await NoticeRepository.updateNotice(id, updatedData);
  },

  deleteNotice: async (id) => {
    return await NoticeRepository.deleteNotice(id);
  },
};

module.exports = NoticeService;
