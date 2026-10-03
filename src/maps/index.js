// ========================================================
// CozyStudy: Haritalar İndeksi (Maps Central Export)
// ========================================================

import { getLightingOverlay, renderDynamicWindowView } from './lighting.js';
import { classroom } from './classroom.js';
import { garden } from './garden.js';
import { cafe } from './cafe.js';
import { campus_path } from './campus_path.js';
import { dorm } from './dorm.js';

export const Maps = {
  getLightingOverlay,
  renderDynamicWindowView,
  classroom,
  garden,
  cafe,
  campus_path,
  dorm
};

if (typeof window !== 'undefined') {
  window.Maps = Maps;
}
