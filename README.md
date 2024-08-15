# yt-pb-calc (Youtube-Playback-Calculator)
CREDITS - kurtnettle

couldn't find any good name. :(

![example-gif](https://raw.githubusercontent.com/kurtnettle/yt-pb-calc/main/assets/example.gif)

# Installation

+ Download the zip file
+ Extract and Load Unpacked in Developer Tools

# To Change the color

+ Open the file in a Code editor
+ Go to src/utils.js
+ Change the Color here
```
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
```
+ Run `npx rollup -c rollup.config.mjs` in the terminal and reload in the extensions

