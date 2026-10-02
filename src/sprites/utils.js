// ========================================================
// CozyStudy: Piksel Sanatı Çizim Yardımcıları
// ========================================================

export function createPixelCanvas(width, height, drawCallback) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  drawCallback(ctx);
  return canvas;
}

export function px(ctx, x, y, color, w = 1, h = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}
