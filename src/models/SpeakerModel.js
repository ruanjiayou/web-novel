import { types, getSnapshot } from 'mobx-state-tree';
import storage from '../utils/storage';

const cfg = storage.getValue('speaker');
const Model = types
  .model('musicPlayer', {
    left: types.optional(types.number, cfg ? cfg.left : 100),
    top: types.optional(types.number, cfg ? cfg.top : 410),
    rate: types.optional(types.number, cfg ? cfg.rate : 1.2),
    pitch: types.optional(types.number, cfg ? cfg.pitch : 0.8),
  })
  .views((self) => ({}))
  .actions((self) => {
    // 音乐播放器相关
    return {
      store(value) {
        const o = {
          left: value.left,
          top: value.top,
          rate: value.rate,
          pitch: value.pitch,
        };
        storage.setValue('speaker', o);
      },
      toJSON() {
        return getSnapshot(self);
      },
    };
  });

export default Model;
