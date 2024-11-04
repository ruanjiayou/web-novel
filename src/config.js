export default {
  get isDebug() {
    return process.env.NODE_ENV !== 'production';
  },

  constant: {
    RESOURCE_STATUS: {
      init: 1,
      loading: 2,
      fail: 3,
      finished: 4,
    },
    MEDIA_STATUS: {
      init: 1,
      loading: 2,
      fail: 3,
      finished: 4,
      transcoding: 5,
    },
    VIDEO_TYPE: {
      normal: 1, // 正片
      trailer: 2,// 预告
      tidbits: 3,// 花絮
      content: 4,// 正文
    },
    IMAGE_TYPE: {
      poster: 1,
      thumbnail: 2,
      content: 3,
      gallery: 4,
    },
    CHAPTER_TYPE: {
      chatper: 1,
      volume: 2,
    },
    MUSIC_TYPE: {
      audio: 1,
      mv: 2,
    },
    FILE_TYPE: {
      other: 0,
      text: 1,
      doc: 2,
      ppt: 3,
      execl: 4,
      image: 5,
      video: 6,
      torrent: 7,
      archive: 8,
      application: 9,
    },
  },
  console: false,
  VERSION: '0.1.0',
  config: {
    production: {
      host: '',
    },
    development: {
      host: '',
    },
  },
  cache: {
    book: {},
    catalog: {},
    chapter: {},
    tree: {},
  },
};
