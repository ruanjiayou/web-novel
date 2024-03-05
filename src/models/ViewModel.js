import { types } from 'mobx-state-tree';
import { models } from 'pages';

export const ViewModel = types.union({
  dispatcher: (sn) => {
    const view = sn.view || 'home';
    return models[view] || models['home'];
  },
});

export default types.optional(ViewModel, { view: 'home', attrs: {} });
