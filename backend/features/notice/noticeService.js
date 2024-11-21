const NoticeRepository = require("./noticeRepository");
const notificationCountRepository = require("../notificationCount/notificationCountRepository");
const societyRepository = require("../society/societyRepository");
const { getSocket } = require("../../utils/socketManager");

const NoticeService = {
  createNotice: async (noticeData, images) => {
    try {
      const societyUsers = await societyRepository.findUsersBySociety(
        noticeData.societyId
      );
      const newNotice = await NoticeRepository.createNotice(
        noticeData,
        images,
        societyUsers
      );

      const io = getSocket();

      // Emit 'noticeCreated' to all users in the society
      io.emit("noticeCreated", {
        societyId: noticeData.societyId,
        notice: newNotice,
      });
      for(let user of societyUsers){
        const updatedCount = await notificationCountRepository.getCount(noticeData.societyId,user.id,'notice')
        io.to(user.id).emit('updatedCount',{
          notice:newNotice,
          count:updatedCount
        })
      }

      return newNotice;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
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
