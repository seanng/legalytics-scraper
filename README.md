# Steps:
1. (if windows) Download cygwin or wsl
1. Download nodejs
1. From this directory, run `npm install` (use cygwin or wsl for windows)
1. Configure the range of documents to scrape by changing START and END values (L69 & 70)
1. Run `node regulations.gov/initial` from this directory (use cygwin or wsl for windows)

# FAQ:
## Debugging
- To debug, insert new line after L23 in `index.js` with `headless: false`
- Try running again.
- Call Sean if help needed
## Slowing it down
- Increase `slowMo` in index.js L23 to 500, or higher.
