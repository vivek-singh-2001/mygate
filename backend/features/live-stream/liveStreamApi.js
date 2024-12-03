const express = require("express");
const { streamRunning, startStreaming } = require("../../utils/ffmpegStart");
const router = express.Router();

router.get("/start-stream", (req, res) => {
  if (!streamRunning) {
    startStreaming();
    return res.status(201).json({ success: true,message: 'Stream started successfully'});
  } else {
    return res.status(201).json({ success: true,message: 'Stream is already running'});
  }
});

module.exports = router;