// ========================================================
// CozyStudy: Master Modular Entrypoint (src/index.js)
// ========================================================

import { EventBus } from '../public/js/event_bus.js';
import { Maps } from './maps/index.js';
import { Sprites } from './sprites/index.js';
import { soundFX } from './audio/index.js';
import { UI } from './ui/index.js';

console.log('🌸 CozyStudy Modular Engine Loaded Successfully!');

export {
  EventBus,
  Maps,
  Sprites,
  soundFX,
  UI
};
