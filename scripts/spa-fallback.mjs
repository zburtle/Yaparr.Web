// Static hosts (GitHub Pages and the like) serve 404.html for paths such as /join; serving the app there makes deep links work.
import { copyFileSync } from 'node:fs';
copyFileSync('dist/yaparr-web/browser/index.html', 'dist/yaparr-web/browser/404.html');
