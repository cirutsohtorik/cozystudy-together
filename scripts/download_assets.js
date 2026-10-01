const https = require('https');
const fs = require('fs');
const path = require('path');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 50) {
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        resolve(); // skip on 404
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      resolve();
    });
  });
}

async function run() {
  const dir = path.join(__dirname, '..', 'public', 'assets', 'tilesets', 'tiny_town');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  console.log('Downloading Tiny Town tiles...');
  const promises = [];
  for (let i = 0; i <= 131; i++) {
    const num = String(i).padStart(4, '0');
    const url = `https://raw.githubusercontent.com/shorepine/kenney/master/2d/Tiny%20Town/Tiles/tile_${num}.png`;
    const dest = path.join(dir, `tile_${num}.png`);
    promises.push(downloadFile(url, dest));
  }
  await Promise.all(promises);
  const urbanDir = path.join(__dirname, '..', 'public', 'assets', 'tilesets', 'rpg_urban');
  if (!fs.existsSync(urbanDir)) fs.mkdirSync(urbanDir, { recursive: true });

  console.log('Downloading RPG Urban Pack tiles...');
  const urbanPromises = [];
  for (let i = 0; i <= 485; i++) {
    const num = String(i).padStart(4, '0');
    const url = `https://raw.githubusercontent.com/shorepine/kenney/master/2d/RPG%20Urban%20Pack/Tiles/tile_${num}.png`;
    const dest = path.join(urbanDir, `tile_${num}.png`);
    urbanPromises.push(downloadFile(url, dest));
  }
  await Promise.all(urbanPromises);
  const urbanFiles = fs.readdirSync(urbanDir).filter(f => f.endsWith('.png'));
  console.log(`Finished! Downloaded ${urbanFiles.length} RPG Urban tiles.`);
}

run();
