const { db } = require("../../config/connection");
const CustomError = require("../../utils/CustomError");
const { Notice ,User} =
  db;

const NoticeRepository = {
  createNotice: async (noticeData,Images) => {
 
    try {
        const mediaFilenames = Images.map(image => image.filename);
        
        const newNotice = await Notice.create({
            text: noticeData.description,
            media: JSON.stringify(mediaFilenames),
            societyId: noticeData.societyId,
            userId: noticeData.userId
        });
        return newNotice;

    } catch (error) {
        throw new CustomError('Could not create notice. Please try again later.',400);
    }
  },

  getAllNotice: async (societyId) => {
    const notices =  await Notice.findAll({
      where:{societyId},
      include: [{
        model: User,
        as:'User',
        attributes: [ 'firstname','lastname', 'email'],
      }],
    });

    return notices.map(notice=>{
      const mediaFilenames = JSON.parse(notice.media);
      const mediaUrls = mediaFilenames.map(filename=>{
        return `${process.env.BASE_URL}/uploads/${filename}`;
      });

      return {
        ...notice.toJSON(),
        mediaUrls
      }
    })
  },

  getNoticeById: async (id) => {
    return await Notice.findByPk(id);
  },

  updateNotice: async (id, updatedData) => {
    return await Notice.update(updatedData, { where: { id } });
  },

  deleteNotice: async (id) => {
    return await Notice.destroy({ where: { id } });
  },
};

module.exports = NoticeRepository;
