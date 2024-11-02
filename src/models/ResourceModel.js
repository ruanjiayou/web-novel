import { types } from 'mobx-state-tree';
import store from 'store';
import services from 'services';

const Model = types
  .model('resource', {
    id: types.string,
    uid: types.maybeNull(types.string),
    uname: types.maybeNull(types.string),
    country: types.maybeNull(types.string, 'China'),
    title: types.string,
    poster: types.optional(types.string, ''),
    thumbnail: types.optional(types.string, ''),
    content: types.optional(types.string, ''),
    desc: types.optional(types.string, ''),
    // url: types.string,
    source_type: types.maybeNull(types.string),
    tags: types.array(types.string),
    images: types.array(
      types.union(
        types.string,
        types.model({
          path: types.optional(types.string, ''),
          id: types.optional(types.string, ''),
          nth: types.optional(types.number, 1),
          more: types.maybe(
            types.model({
              width: types.maybe(types.number),
              height: types.maybe(types.number),
            }),
          ),
        }),
      ),
    ),
    status: types.enumeration(['init', 'loading', 'finished', 'fail']),
    types: types.array(types.string),
    createdAt: types.optional(types.string, new Date().toLocaleString()),
    duration: types.optional(types.number, 0),
    counter: types.maybeNull(types.model({
      words: types.maybeNull(types.number),
      comments: types.maybeNull(types.number),
      chapters: types.maybeNull(types.number),
      collections: types.maybeNull(types.number),
    })),

    // 临时非数据库字段
    last: types.optional(
      types.model('last', {
        url: types.optional(types.string, ''),
        title: types.optional(types.string, ''),
        createdAt: types.optional(types.string, ''),
        updatedAt: types.optional(types.string, ''),
        progress: types.optional(types.number, 0),
        sub_id: types.optional(types.string, ''),
        sub_type: types.optional(types.string, ''),
      }),
      {},
    ),
    playing: types.optional(types.boolean, false),
    audios: types.array(
      types.model({
        id: types.string,
        type: types.string,
        path: types.string,
      }),
    ),
    //
    marked: types.optional(types.boolean, false),
    videos: types.array(
      types.model({
        title: types.union(types.undefined, types.string),
        path: types.string,
        nth: types.number,
        id: types.string,
        subtitles: types.maybeNull(types.array(types.model({
          lang: types.string,
          title: types.optional(types.string, ''),
          path: types.string,
        })))
      }),
    ),
  })
  .actions((self) => ({
    toggleStatus() {
      self.playing = !self.playing;
    },
    async setMarked(marked) {
      self.marked = marked;
      const data = { id: self.id };
      if (marked) {
        await services.createMark({ data });
      } else {
        await services.destroyMark({ params: data });
      }
    },
  }))
  .views((self) => ({
    get auto_cover() {
      const poster =
        self.poster || self.thumbnail
          ? self.thumbnail || self.poster
          : '/images/poster/nocover.jpg';
      return store.lineLoader.getHostByType('image') + poster;
    },
  }));

export default Model;
