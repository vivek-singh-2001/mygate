// utils/streamUtils.js

const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Define the RTSP URL and HLS folder
const RTSP_URL = 'rtsp://localhost:8554/live'; // Update with your RTSP camera URL
const HLS_FOLDER = path.join(__dirname, '..', 'hls');

// Ensure HLS folder exists
if (!fs.existsSync(HLS_FOLDER)) {
  fs.mkdirSync(HLS_FOLDER, { recursive: true });
}

let streamRunning = false; // To track stream status

// Function to start streaming
const startStreaming = () => {
  if (streamRunning) {
    console.log('Stream is already running');
    return;
  }

  streamRunning = true;

  ffmpeg(RTSP_URL)
    .outputOptions([
      '-c:v copy',
      '-c:a aac',
      '-f hls',
      '-hls_time 2',
      '-hls_list_size 3',
      '-hls_flags delete_segments',
    ])
    .output(path.join(HLS_FOLDER, 'stream.m3u8'))
    .on('start', () => {
      console.log('FFmpeg streaming started...');
    })
    .on('error', (err) => {
      console.error('FFmpeg error:', err.message);
      streamRunning = false; // Reset stream state on error
    })
    .on('end', () => {
      console.log('FFmpeg streaming ended.');
      streamRunning = false; // Reset stream state after ending
    })
    .run();
};

// Export the start streaming function
module.exports = { startStreaming, streamRunning };
