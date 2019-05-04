const uuid = require("uuid/v4");

const bookmarks = [
  {
    id: uuid(),
    title: "Google",
    url: "http://www.google.com",
    rating: "3",
    desc: "Internet-related services and products."
  },
  {
    id: uuid(),
    title: "Thinkful",
    url: "http://www.thinkful.com",
    rating: "5",
    desc:
      "1-on-1 learning to accelerate your way to a new high-growth tech career!"
  },
  {
    id: uuid(),
    title: "Github",
    url: "http://www.github.com",
    rating: "4",
    desc: "brings together the world's largest community of developers."
  }
];

module.exports = { bookmarks };
