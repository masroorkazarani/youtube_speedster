import { setDurationText } from './utils.js';
import { getVideoElement } from './helpers.js';

export const DEBUG_TAG = '[yt-pb-calc] [desktop]';

let hasAddedVideoListener = false;
let hasAddedVideoListenerChecktimer = null;

function updateDuration(video, animate = false) {
  if (animate) {
    const adjustedTimeElements = document.querySelectorAll('.yt-pb-calc-adjusted-time');
    adjustedTimeElements.forEach(el => {
      el.style.opacity = '0';
      setTimeout(() => {
        setDurationText(video.playbackRate, video.duration, video.currentTime);
        el.style.opacity = '1';
      }, 300);
    });
  } else {
    setDurationText(video.playbackRate, video.duration, video.currentTime);
  }
}

function addVideoListener() {
  if (hasAddedVideoListener) {
    console.debug(`${DEBUG_TAG} - already added event listener.`);
    if (hasAddedVideoListenerChecktimer !== null) {
      console.debug(`${DEBUG_TAG} - cleared the timer.`);
      clearInterval(hasAddedVideoListenerChecktimer);
    }
    return;
  }

  const video = getVideoElement();
  if (video == null) {
    console.debug(`${DEBUG_TAG} - failed to get video element.`);
    if (hasAddedVideoListenerChecktimer === null) {
      console.debug(`${DEBUG_TAG} - added timer.`);
      hasAddedVideoListenerChecktimer = setInterval(addVideoListener, 150);
    }
  } else {
    console.debug(`${DEBUG_TAG} - got video element. Adding event listeners.`);

    video.addEventListener('ratechange', () => updateDuration(video, true));
    video.addEventListener('timeupdate', () => updateDuration(video));

    // Initial update
    updateDuration(video);

    hasAddedVideoListener = true;
    clearInterval(hasAddedVideoListenerChecktimer);
  }
}

document.addEventListener('yt-navigate-finish', function (event) {
  console.debug(`${DEBUG_TAG} - finish navigation`);
  hasAddedVideoListener = false;
  addVideoListener();
});

// Initial call to set up listeners
addVideoListener();
