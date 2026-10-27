# Birthday site for Kerita

Plain HTML/CSS/JS. No build step, no backend, no trackers (only Google Fonts, with fallbacks).

## What to edit
Everything personal is in **`config.js`**: name, hero line, photo captions, the "things I appreciate" cards (replace each `[EDIT]`), the letter (one string per paragraph), track title, and reveal text.

## Photos
The photos are in `assets/photos/` as `1.jpeg` … `9.jpeg` and are listed in `config.js`. To change them, edit the `photos` list to match your filenames (add or remove entries freely). Resize them to about 1200px wide first. Missing files show a dashed "Add photo" frame instead of a broken image.

## Audio
The beat is in `assets/audio/1. Dilemma @_joey.wav 108.mp3`, and `audioSrc` in `config.js` points to it. To use a different file, update `audioSrc`. MP3 works everywhere. If the file is missing, the player disables itself and shows a message.

## Run locally
`python3 -m http.server 8000` in this folder, then open http://localhost:8000 (opening index.html directly also works).

## Publish (about 2 minutes)
Netlify: go to app.netlify.com/drop and drag this whole folder in. You get a shareable link immediately. GitHub Pages also works (push the folder, enable Pages).
