// ========================================================
// CozyStudy: Canlı NPC Karakterleri (NPC Sprites)
// Prof. Hikmet, Pelin, Mert, Salih Amca, Melis, Ege, Barista Deniz, vb.
// ========================================================

import { createPixelCanvas, px } from './utils.js';

export function createNPCSprites() {
  const cache = {};
  const drawPx = (ctx, x, y, c, w = 1, h = 1) => px(ctx, x, y, c, w, h);

  // 1. Prof. Hikmet
  cache['npc_teacher'] = createPixelCanvas(26, 34, (ctx) => {
    drawPx(ctx, 8, 24, '#2b2d42', 4, 6);
    drawPx(ctx, 14, 24, '#2b2d42', 4, 6);
    drawPx(ctx, 7, 29, '#1a1a1a', 5, 3);
    drawPx(ctx, 14, 29, '#1a1a1a', 5, 3);
    drawPx(ctx, 6, 14, '#4a3319', 14, 11);
    drawPx(ctx, 7, 15, '#6a4a27', 12, 9);
    drawPx(ctx, 11, 14, '#ffffff', 4, 4);
    drawPx(ctx, 12, 16, '#9e2a2b', 2, 6);
    drawPx(ctx, 7, 5, '#e0b284', 12, 9);
    drawPx(ctx, 8, 5, '#ffd4a3', 10, 8);
    drawPx(ctx, 9, 8, '#333333', 3, 2);
    drawPx(ctx, 14, 8, '#333333', 3, 2);
    drawPx(ctx, 10, 8, '#ffffff', 1, 1);
    drawPx(ctx, 15, 8, '#ffffff', 1, 1);
    drawPx(ctx, 12, 8, '#d4af37', 2, 1);
    drawPx(ctx, 11, 11, '#e5e5e5', 4, 2);
    drawPx(ctx, 6, 3, '#d3d3d3', 14, 4);
    drawPx(ctx, 5, 5, '#bfbfbf', 3, 6);
    drawPx(ctx, 18, 5, '#bfbfbf', 3, 6);
    drawPx(ctx, 17, 18, '#1d3557', 6, 8);
    drawPx(ctx, 18, 19, '#f1faee', 4, 6);
  });

  // 2. Pelin
  cache['npc_student_reading'] = createPixelCanvas(24, 32, (ctx) => {
    drawPx(ctx, 5, 12, '#502910', 14, 12);
    drawPx(ctx, 6, 13, '#753f19', 12, 10);
    drawPx(ctx, 7, 14, '#c85a3e', 10, 8);
    drawPx(ctx, 8, 14, '#e76f51', 8, 7);
    drawPx(ctx, 6, 18, '#e76f51', 3, 4);
    drawPx(ctx, 15, 18, '#e76f51', 3, 4);
    drawPx(ctx, 6, 5, '#ffd4a3', 12, 9);
    drawPx(ctx, 8, 8, '#264653', 2, 2);
    drawPx(ctx, 8, 8, '#fff', 1, 1);
    drawPx(ctx, 14, 8, '#264653', 2, 2);
    drawPx(ctx, 14, 8, '#fff', 1, 1);
    drawPx(ctx, 7, 10, '#f99f9f', 2, 1);
    drawPx(ctx, 15, 10, '#f99f9f', 2, 1);
    drawPx(ctx, 5, 3, '#54361e', 14, 4);
    drawPx(ctx, 18, 6, '#54361e', 4, 8);
    drawPx(ctx, 17, 5, '#e76f51', 2, 2);
    drawPx(ctx, 7, 21, '#ffd4a3', 10, 2);
    drawPx(ctx, 8, 20, '#2a9d8f', 8, 4);
    drawPx(ctx, 9, 21, '#ffffff', 6, 2);
  });

  // 3. Mert
  cache['npc_student_tech'] = createPixelCanvas(24, 32, (ctx) => {
    drawPx(ctx, 5, 12, '#502910', 14, 12);
    drawPx(ctx, 6, 13, '#753f19', 12, 10);
    drawPx(ctx, 7, 14, '#1d3557', 10, 8);
    drawPx(ctx, 8, 14, '#27476e', 8, 7);
    drawPx(ctx, 6, 5, '#ffd4a3', 12, 9);
    drawPx(ctx, 8, 8, '#1e1109', 2, 2);
    drawPx(ctx, 14, 8, '#1e1109', 2, 2);
    drawPx(ctx, 6, 3, '#2b1e16', 12, 4);
    drawPx(ctx, 4, 6, '#e63946', 3, 6);
    drawPx(ctx, 17, 6, '#e63946', 3, 6);
    drawPx(ctx, 6, 2, '#333333', 12, 2);
  });

  // 4. Salih Amca
  cache['npc_gardener'] = createPixelCanvas(28, 36, (ctx) => {
    drawPx(ctx, 9, 26, '#3a5a40', 4, 5);
    drawPx(ctx, 15, 26, '#3a5a40', 4, 5);
    drawPx(ctx, 8, 30, '#582f0e', 5, 4);
    drawPx(ctx, 15, 30, '#582f0e', 5, 4);
    drawPx(ctx, 7, 16, '#a3b18a', 14, 10);
    drawPx(ctx, 8, 17, '#588157', 12, 9);
    drawPx(ctx, 9, 16, '#3a5a40', 2, 10);
    drawPx(ctx, 17, 16, '#3a5a40', 2, 10);
    drawPx(ctx, 8, 7, '#d4a373', 12, 9);
    drawPx(ctx, 10, 10, '#333', 2, 2);
    drawPx(ctx, 16, 10, '#333', 2, 2);
    drawPx(ctx, 11, 13, '#fff', 6, 2);
    drawPx(ctx, 4, 5, '#dda15e', 20, 3);
    drawPx(ctx, 8, 1, '#bc6c25', 12, 5);
    drawPx(ctx, 8, 4, '#606c38', 12, 1);
    drawPx(ctx, 21, 20, '#2a9d8f', 6, 7);
    drawPx(ctx, 25, 17, '#264653', 2, 4);
    drawPx(ctx, 27, 24, '#e76f51', 1, 1);
    drawPx(ctx, 26, 28, '#48cae4', 1, 2);
    drawPx(ctx, 27, 31, '#48cae4', 1, 2);
  });

  // 5. Ressam Melis
  cache['npc_artist'] = createPixelCanvas(34, 36, (ctx) => {
    drawPx(ctx, 2, 6, '#8d5b4c', 2, 28);
    drawPx(ctx, 12, 6, '#8d5b4c', 2, 28);
    drawPx(ctx, 7, 2, '#6f4538', 2, 32);
    drawPx(ctx, 1, 8, '#ffffff', 14, 14);
    drawPx(ctx, 1, 8, '#d4a373', 14, 1);
    drawPx(ctx, 1, 21, '#d4a373', 14, 1);
    drawPx(ctx, 3, 14, '#3a88b5', 10, 4);
    drawPx(ctx, 5, 10, '#ffb703', 3, 3);
    drawPx(ctx, 6, 17, '#588157', 6, 3);
    drawPx(ctx, 18, 16, '#f4a261', 10, 10);
    drawPx(ctx, 19, 18, '#e76f51', 2, 2);
    drawPx(ctx, 23, 20, '#2a9d8f', 2, 2);
    drawPx(ctx, 18, 7, '#ffd4a3', 10, 8);
    drawPx(ctx, 20, 10, '#264653', 2, 2);
    drawPx(ctx, 19, 12, '#ff9aa2', 2, 1);
    drawPx(ctx, 16, 4, '#d62828', 14, 4);
    drawPx(ctx, 22, 2, '#ba181b', 2, 3);
    drawPx(ctx, 14, 15, '#d4af37', 5, 1);
    drawPx(ctx, 13, 15, '#e63946', 1, 1);
  });

  // 6. Ege
  cache['npc_student_relax'] = createPixelCanvas(26, 26, (ctx) => {
    drawPx(ctx, 4, 18, '#3d6e2e', 18, 6);
    drawPx(ctx, 5, 15, '#2b3a4a', 16, 7);
    drawPx(ctx, 8, 9, '#2d6a4f', 10, 7);
    drawPx(ctx, 8, 2, '#ffd4a3', 10, 7);
    drawPx(ctx, 10, 5, '#1e1109', 2, 2);
    drawPx(ctx, 7, 0, '#523420', 12, 3);
    drawPx(ctx, 7, 12, '#ffb703', 12, 6);
    drawPx(ctx, 8, 13, '#ffffff', 10, 4);
    drawPx(ctx, 12, 13, '#333333', 1, 4);
  });

  // 7. Barista Deniz
  cache['npc_barista'] = createPixelCanvas(26, 34, (ctx) => {
    drawPx(ctx, 8, 25, '#1b1b1b', 4, 6);
    drawPx(ctx, 14, 25, '#1b1b1b', 4, 6);
    drawPx(ctx, 6, 14, '#f8f9fa', 14, 11);
    drawPx(ctx, 7, 16, '#3e2723', 12, 10);
    drawPx(ctx, 9, 15, '#271714', 2, 8);
    drawPx(ctx, 15, 15, '#271714', 2, 8);
    drawPx(ctx, 11, 20, '#d4af37', 4, 3);
    drawPx(ctx, 7, 5, '#ffe0bd', 12, 9);
    drawPx(ctx, 9, 8, '#1e293b', 2, 2);
    drawPx(ctx, 9, 8, '#ffffff', 1, 1);
    drawPx(ctx, 15, 8, '#1e293b', 2, 2);
    drawPx(ctx, 15, 8, '#ffffff', 1, 1);
    drawPx(ctx, 11, 11, '#e76f51', 4, 1);
    drawPx(ctx, 8, 10, '#ffb4a2', 2, 1);
    drawPx(ctx, 16, 10, '#ffb4a2', 2, 1);
    drawPx(ctx, 5, 2, '#4e342e', 16, 4);
    drawPx(ctx, 6, 0, '#271714', 14, 3);
    drawPx(ctx, 18, 17, '#bdc3c7', 6, 7);
    drawPx(ctx, 19, 16, '#ffffff', 4, 2);
  });

  // 8. Yazar Sinan
  cache['npc_writer'] = createPixelCanvas(24, 32, (ctx) => {
    drawPx(ctx, 5, 12, '#502910', 14, 12);
    drawPx(ctx, 6, 13, '#753f19', 12, 10);
    drawPx(ctx, 7, 14, '#b7871b', 10, 8);
    drawPx(ctx, 8, 14, '#d4a324', 8, 7);
    drawPx(ctx, 6, 5, '#ffd4a3', 12, 9);
    drawPx(ctx, 8, 8, '#333', 2, 2);
    drawPx(ctx, 13, 8, '#333', 2, 2);
    drawPx(ctx, 10, 8, '#c9a227', 3, 1);
    drawPx(ctx, 5, 3, '#3d2616', 14, 3);
    drawPx(ctx, 6, 20, '#582f0e', 12, 3);
  });

  // 9. Aslı
  cache['npc_music_fan'] = createPixelCanvas(24, 32, (ctx) => {
    drawPx(ctx, 5, 12, '#502910', 14, 12);
    drawPx(ctx, 6, 13, '#753f19', 12, 10);
    drawPx(ctx, 7, 14, '#529b93', 10, 8);
    drawPx(ctx, 8, 14, '#83c5be', 8, 7);
    drawPx(ctx, 6, 5, '#ffe0bd', 12, 9);
    drawPx(ctx, 8, 8, '#264653', 2, 2);
    drawPx(ctx, 8, 8, '#fff', 1, 1);
    drawPx(ctx, 14, 8, '#264653', 2, 2);
    drawPx(ctx, 14, 8, '#fff', 1, 1);
    drawPx(ctx, 7, 10, '#ffb4a2', 2, 1);
    drawPx(ctx, 15, 10, '#ffb4a2', 2, 1);
    drawPx(ctx, 4, 6, '#7209b7', 3, 6);
    drawPx(ctx, 17, 6, '#7209b7', 3, 6);
    drawPx(ctx, 6, 2, '#480ca8', 12, 2);
  });

  // 10. Ayşe
  cache['npc_ayse'] = createPixelCanvas(24, 32, (ctx) => {
    drawPx(ctx, 7, 23, '#2b2d42', 4, 6);
    drawPx(ctx, 13, 23, '#2b2d42', 4, 6);
    drawPx(ctx, 6, 28, '#4a2810', 5, 3);
    drawPx(ctx, 13, 28, '#4a2810', 5, 3);
    drawPx(ctx, 6, 13, '#c9a885', 12, 11);
    drawPx(ctx, 7, 14, '#dfc5a6', 10, 9);
    drawPx(ctx, 4, 15, '#e07a5f', 3, 9);
    drawPx(ctx, 3, 19, '#f4ece1', 4, 5);
    drawPx(ctx, 6, 4, '#ffd4a3', 12, 9);
    drawPx(ctx, 8, 7, '#3d405b', 2, 2);
    drawPx(ctx, 14, 7, '#3d405b', 2, 2);
    drawPx(ctx, 7, 9, '#ff9aa2', 2, 1);
    drawPx(ctx, 15, 9, '#ff9aa2', 2, 1);
    drawPx(ctx, 5, 2, '#7f4f24', 14, 4);
    drawPx(ctx, 4, 5, '#582f0e', 3, 8);
    drawPx(ctx, 17, 5, '#582f0e', 3, 8);
    drawPx(ctx, 17, 4, '#81b29a', 2, 2);
    drawPx(ctx, 13, 18, '#81b29a', 6, 5);
    drawPx(ctx, 14, 19, '#f4f1de', 4, 3);
  });

  // 11. Kerem
  cache['npc_kerem'] = createPixelCanvas(26, 32, (ctx) => {
    drawPx(ctx, 6, 12, '#3d5a80', 14, 11);
    drawPx(ctx, 7, 13, '#4d729f', 12, 9);
    drawPx(ctx, 5, 22, '#293241', 16, 6);
    drawPx(ctx, 7, 4, '#ffd4a3', 12, 8);
    drawPx(ctx, 9, 7, '#1e1109', 2, 2);
    drawPx(ctx, 15, 7, '#1e1109', 2, 2);
    drawPx(ctx, 6, 1, '#ee9b00', 14, 5);
    drawPx(ctx, 7, 2, '#ca6702', 12, 2);
    drawPx(ctx, 6, 18, '#1e293b', 14, 3);
    drawPx(ctx, 8, 15, '#7dd3fc', 10, 4);
  });

  return cache;
}
