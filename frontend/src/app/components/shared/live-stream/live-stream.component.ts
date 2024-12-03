import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Hls from 'hls.js';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-live-stream',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-stream.component.html',
  styleUrl: './live-stream.component.css',
})
export class LiveStreamComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  streamUrl: string = 'http://192.1.125.175:7500/hls/stream.m3u8';
  currentTime: string = '';

  constructor() {}

  ngOnInit(): void {
    this.updateTime();
  }

  ngAfterViewInit(): void {
    this.startStream();
  }

  startStream(): void {
    // Check if HLS.js is supported
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.streamUrl);
      hls.attachMedia(this.videoPlayer.nativeElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Try to play video when the manifest is parsed
        this.videoPlayer.nativeElement.muted = true; // Muting video to allow autoplay
        this.videoPlayer.nativeElement.play().catch((error) => {
          console.error('Autoplay failed:', error); // Catching autoplay issues
        });
      });

      // Handling HLS.js errors
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js error:', data);
      });
    }
    // Fallback for browsers that support HLS natively (like Safari)
    else if (
      this.videoPlayer.nativeElement.canPlayType(
        'application/vnd.apple.mpegurl'
      )
    ) {
      this.videoPlayer.nativeElement.src = this.streamUrl;
      this.videoPlayer.nativeElement.addEventListener('loadedmetadata', () => {
        this.videoPlayer.nativeElement.muted = true; // Muting video to allow autoplay
        this.videoPlayer.nativeElement.play().catch((error) => {
          console.error('Autoplay failed:', error); // Catching autoplay issues
        });
      });
    } else {
      console.error('HLS not supported on this browser.');
    }
  }

  updateTime(): void {
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }, 1000);
  }
}
