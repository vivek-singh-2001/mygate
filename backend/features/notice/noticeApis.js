
const express = require('express');
const NoticeController = require('./noticeController');
const upload = require('../../middleware/multer');

const router = express.Router();

const { uploadMultiple } = upload(/jpeg|jpg|png|webp/);

router.post('/', uploadMultiple,NoticeController.createNotice);
router.get('/getAllNotice/:societyId', NoticeController.getAllNotice);
router.get('/:id', NoticeController.getNoticeById);
router.put('/:id', NoticeController.updateNotice);
router.delete('/:id', NoticeController.deleteNotice);

module.exports = router;
