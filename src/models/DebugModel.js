import { types } from 'mobx-state-tree';

const Model = types
  .model({
    maps: types.array(types.frozen({})),
    messages: types.array(types.string),
    showMap: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    append(message) {
      self.messages.push(message);
    },
    update(key, value) {
      const found = self.maps.find((item) => item.key === key);
      if (found) {
        found.value = value;
      } else {
        self.maps.push({ key, value });
      }
    },
    clear() {
      self.messages = [];
      self.map = {};
    },
    toggleMap() {
      self.showMap = !self.showMap;
    },
  }));

export default Model;
