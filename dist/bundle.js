(function (exports) {
  'use strict';

  const D_VIDEO_DURATION_ITEMS = 'span.ytp-time-duration';
  const M_VIDEO_DURATION_ITEMS = 'span.time-second';
  const SPONSORBLOCKDURATION_ELEM = 'span#sponsorBlockDurationAfterSkips';
  const VIDEO_CLASSLIST = ['video-stream', 'html5-main-video'];

  function getVideoElement () {
    const videos = document.getElementsByTagName('video');
    for (const video of videos) {
      if (VIDEO_CLASSLIST.every(_class => video.classList.contains(_class))) return video;
    }
  }

  function getSponsorBlockDurationElement () {
    return document.querySelector(SPONSORBLOCKDURATION_ELEM);
  }

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

  function setDurationText(playbackRate, duration, currentTime) {
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

  const DEBUG_TAG = '[yt-pb-calc] [desktop]';

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

  exports.DEBUG_TAG = DEBUG_TAG;

  return exports;

})({});
