import { D_VIDEO_DURATION_ITEMS, M_VIDEO_DURATION_ITEMS } from './css_selectors.js';
import { getSponsorBlockDurationElement } from './helpers.js';

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .yt-pb-calc-adjusted-time {
      color: #8B0000;
      transition: opacity 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}

export function setDurationText(playbackRate, duration, currentTime) {
  addStyles();
  const durationItems = document.querySelectorAll(D_VIDEO_DURATION_ITEMS + ',' + M_VIDEO_DURATION_ITEMS);
  const sponsorBlockDurationElement = getSponsorBlockDurationElement();

  if (durationItems.length > 0) {
    const adjustedDuration = duration / playbackRate;
    const adjustedCurrentTime = currentTime / playbackRate;
    const durationText = formatTime(adjustedDuration);
    const currentTimeText = formatTime(adjustedCurrentTime);

    durationItems.forEach((item) => {
      const originalText = item.textContent.split(' (')[0]; // Get only the original time
      if (playbackRate !== 1) {
        item.innerHTML = `${originalText} <span class="yt-pb-calc-adjusted-time">(${currentTimeText} / ${durationText})</span>`;
      } else {
        item.textContent = originalText;
      }
    });

    if (sponsorBlockDurationElement) {
      const originalText = sponsorBlockDurationElement.textContent.split(' (')[0];
      if (playbackRate !== 1) {
        const sbDuration = parseFloat(originalText);
        const adjustedSbDuration = sbDuration / playbackRate;
        sponsorBlockDurationElement.innerHTML = `${originalText} <span class="yt-pb-calc-adjusted-time">(${formatTime(adjustedSbDuration)})</span>`;
      } else {
        sponsorBlockDurationElement.textContent = originalText;
      }
    }
  }
}
