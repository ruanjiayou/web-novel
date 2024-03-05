const Mock = require("mockjs");

module.exports = {
  "get /v1/public/book/:id([0-9a-zA-Z]+)": async function getBookInfo() {
    return Mock.mock({
      code: 0,
      data: {
        id: "@guid",
        title: "@ctitle",
        uid: "@guid",
        uname: "@cname",
        avatar: Mock.Random.image("60x80", "##FF6600"),
        poster: Mock.Random.image("60x80", "##FF6600"),
        desc: "@cparagraph",
        "tags|3-5": ["@cword"],
        words: "@natural(60,100)",
        comments: "@natural(60, 100)",
        collections: "@natural(60, 100)",
        chapters: "@natural(160, 1100)",
        isApproved: true,
        "status|1": ["loading", "finished"],
        createdAt: "@datetime",
      },
    });
  },
};
