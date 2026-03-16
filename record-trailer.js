/**
 * record-trailer.js
 *
 * Запуск:
 *   npm install
 *   npm run dev          ← в одном терминале (оставь работать)
 *   node record-trailer.js   ← в другом терминале
 *
 * Результат: war-trailer.mp4
 * Нужен ffmpeg: https://ffmpeg.org/download.html
 *   Mac:     brew install ffmpeg
 *   Windows: https://www.gyan.dev/ffmpeg/builds/
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Настройки ────────────────────────────────────────────────────────────────
const CONFIG = {
  url: 'http://localhost:5173',
  outputFile: 'war-trailer.mp4',
  framesDir: './frames',

  // iPhone 14 Pro
  width: 393,
  height: 852,
  deviceScaleFactor: 3,       // итоговое: 1179×2556

  fps: 30,
  maxDurationSeconds: 30,     // максимум — остановится раньше по TRAILER_DONE
};
// ─────────────────────────────────────────────────────────────────────────────

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  // Чистим старые кадры
  if (fs.existsSync(CONFIG.framesDir)) {
    fs.rmSync(CONFIG.framesDir, { recursive: true });
  }
  fs.mkdirSync(CONFIG.framesDir);

  console.log('🚀 Запускаем браузер...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
      '--disable-lcd-text',
      '--force-device-scale-factor=' + CONFIG.deviceScaleFactor,
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: CONFIG.width,
    height: CONFIG.height,
    deviceScaleFactor: CONFIG.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
  });

  // Перехватываем console.log из страницы
  let trailerDone = false;
  page.on('console', msg => {
    if (msg.text() === 'TRAILER_DONE') {
      trailerDone = true;
      console.log('✅ Получен сигнал TRAILER_DONE');
    }
  });

  console.log(`🌐 Открываем ${CONFIG.url}...`);
  await page.goto(CONFIG.url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Даём время React смонтироваться и KaTeX загрузиться
  console.log('⏳ Ждём инициализации...');
  await sleep(1500);

  console.log(`📸 Начинаем запись (${CONFIG.fps}fps, макс ${CONFIG.maxDurationSeconds}с)...`);
  console.log(`📐 Разрешение: ${CONFIG.width * CONFIG.deviceScaleFactor}×${CONFIG.height * CONFIG.deviceScaleFactor}`);

  const totalFrames = CONFIG.fps * CONFIG.maxDurationSeconds;
  const frameIntervalMs = 1000 / CONFIG.fps;
  let frameCount = 0;
  let extraFrames = 0;

  for (let i = 0; i < totalFrames; i++) {
    const tickStart = Date.now();

    const framePath = path.join(
      CONFIG.framesDir,
      `frame_${String(frameCount).padStart(6, '0')}.png`
    );

    await page.screenshot({
      path: framePath,
      type: 'png',
    });

    frameCount++;

    // Прогресс каждую секунду
    if (frameCount % CONFIG.fps === 0) {
      const sec = Math.floor(frameCount / CONFIG.fps);
      process.stdout.write(`\r  ⏱  ${sec}s записано...`);
    }

    // Трейлер закончился — дозаписываем 1.5 секунды финального кадра и выходим
    if (trailerDone) {
      extraFrames++;
      if (extraFrames >= CONFIG.fps * 1.5) break;
    }

    // Ждём до следующего кадра
    const elapsed = Date.now() - tickStart;
    const wait = Math.max(0, frameIntervalMs - elapsed);
    if (wait > 0) await sleep(wait);
  }

  console.log(`\n\n🎬 Кадров снято: ${frameCount} (${(frameCount / CONFIG.fps).toFixed(1)}с)`);
  await browser.close();

  // ─── ffmpeg → mp4 ──────────────────────────────────────────────────────────
  console.log('\n🔧 Собираем MP4 через ffmpeg...');

  const w = CONFIG.width * CONFIG.deviceScaleFactor;
  const h = CONFIG.height * CONFIG.deviceScaleFactor;

  // Высота должна быть чётной для libx264
  const safeH = h % 2 === 0 ? h : h - 1;

  const ffmpegCmd = [
    'ffmpeg -y',
    `-framerate ${CONFIG.fps}`,
    `-i "${CONFIG.framesDir}/frame_%06d.png"`,
    `-vf "scale=${w}:${safeH}"`,
    '-c:v libx264',
    '-preset slow',
    '-crf 18',
    '-pix_fmt yuv420p',
    '-movflags +faststart',
    `"${CONFIG.outputFile}"`,
  ].join(' ');

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });

    const stats = fs.statSync(CONFIG.outputFile);
    const sizeMb = (stats.size / 1024 / 1024).toFixed(1);

    console.log(`\n✅ Готово!`);
    console.log(`📁 Файл:       ${CONFIG.outputFile}`);
    console.log(`📐 Разрешение: ${w}×${safeH}`);
    console.log(`💾 Размер:     ${sizeMb} MB`);

    fs.rmSync(CONFIG.framesDir, { recursive: true });
    console.log('🗑  Временные кадры удалены');
  } catch (e) {
    console.error('\n❌ ffmpeg не найден или завершился с ошибкой.');
    console.log('Кадры сохранены в ./frames/');
    console.log('\nЗапусти вручную:');
    console.log(ffmpegCmd);
  }
}

main().catch(err => {
  console.error('❌ Ошибка:', err.message);
  process.exit(1);
});