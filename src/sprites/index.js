// ========================================================
// CozyStudy: Sprites İndeksi (Sprites Central Export)
// ========================================================

import { createCharacterSprites } from './characters.js';
import { createFurnitureSprites, createGazeboSprites } from './furniture.js';
import { createCatSprites, createHugSprite, createDecorSprites } from './decor.js';
import { createNPCSprites } from './npcs.js';
import { createDormSprites } from './dorm.js';
import { createCampusSprites } from './campus.js';
import { createItemSprites } from './items.js';
import { createPortraitSprites } from './portraits.js';

export const Sprites = {
  cache: {},

  init() {
    this.cache['Can'] = createCharacterSprites('Can');
    this.cache['Sezen'] = createCharacterSprites('Sezen');

    Object.assign(this.cache, createFurnitureSprites());
    Object.assign(this.cache, createGazeboSprites());
    Object.assign(this.cache, createCatSprites());
    Object.assign(this.cache, createDecorSprites());
    Object.assign(this.cache, createHugSprite());
    Object.assign(this.cache, createNPCSprites());
    Object.assign(this.cache, createDormSprites());
    Object.assign(this.cache, createCampusSprites());
    Object.assign(this.cache, createItemSprites());
    Object.assign(this.cache, createPortraitSprites());

    if (typeof window !== 'undefined' && window.AssetLoader) {
      window.AssetLoader.init();
    }
  },

  getPortraitDataUrl(name) {
    if (!name) return '';
    const canvas = this.cache['portrait_' + name];
    if (canvas && canvas.toDataURL) {
      return canvas.toDataURL();
    }
    return '';
  }
};

if (typeof window !== 'undefined') {
  window.Sprites = Sprites;
}
