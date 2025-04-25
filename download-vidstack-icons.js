const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

// List of icon names from your provided code
const iconNames = [
  "accessibility","add-note","add-playlist","add-user","add","airplay","arrow-collapse-in","arrow-collapse",
  "arrow-down","arrow-expand-out","arrow-expand","arrow-left","arrow-right","arrow-up","bookmark","camera",
  "chapters","chat-collapse","chat","check","chevron-down","chevron-left","chevron-right","chevron-up",
  "chromecast","clip","closed-captions-on","closed-captions","comment","computer","device","download",
  "episodes","eye","fast-backward","fast-forward","flag","fullscreen-arrow-exit","fullscreen-arrow",
  "fullscreen-exit","fullscreen","heart","info","language","link","lock-closed","lock-open","menu-horizontal",
  "menu-vertical","microphone","mobile","moon","music-off","music","mute","next","no-eye","notification",
  "odometer","pause","picture-in-picture-exit","picture-in-picture","play","playback-speed-circle","playlist",
  "previous","question-mark","queue-list","radio-button-selected","radio-button","repeat-on","repeat-square-on",
  "repeat-square","repeat","replay","rotate","search","seek-backward-10","seek-backward-15","seek-backward-30",
  "seek-backward","seek-forward-10","seek-forward-15","seek-forward-30","seek-forward","send","settings-menu",
  "settings-switch","settings","share-arrow","share","shuffle-on","shuffle","stop","subtitles","sun",
  "theatre-mode-exit","theatre-mode","thumbs-down","thumbs-up","timer","transcript","tv","user","volume-high",
  "volume-low","x-mark"
];

const baseUrl = 'https://cdn.jsdelivr.net/npm/media-icons@1.1.5/dist/icons/';
const outDir = path.join(__dirname, 'assets', 'icons');

async function downloadIcons() {
  await fs.mkdir(outDir, { recursive: true });
  for (const name of iconNames) {
    const url = `${baseUrl}${name}.svg`;
    const dest = path.join(outDir, `${name}.svg`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
      const svg = await res.text();
      await fs.writeFile(dest, svg, 'utf8');
      console.log(`Downloaded: ${name}.svg`);
    } catch (err) {
      console.error(`Error downloading ${name}: ${err.message}`);
    }
  }
}

downloadIcons();