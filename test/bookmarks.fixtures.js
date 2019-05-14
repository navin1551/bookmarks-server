function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: "bookmark1",
      url: "url1",
      description: "adlfjl",
      rating: 1
    },
    {
      id: 2,
      title: "bookmark2",
      url: "url2",
      description: "adlfjlafdd",
      rating: 2
    },
    {
      id: 3,
      title: "bookmark3",
      url: "url3",
      description: "adlfafdffdfdjl",
      rating: 3
    },
    {
      id: 4,
      title: "bookmark4",
      url: "url4",
      description: "adlfdfddfdffjl",
      rating: 4
    },
    {
      id: 5,
      title: "bookmark5",
      url: "url5",
      description: "adfdfdfdfdfdttttlfjl",
      rating: 5
    }
  ];
}

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    url: "https://www.hackers.com",
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    rating: 1
  };
  const expectedBookmark = {
    ...maliciousBookmark,
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousBookmark,
    expectedBookmark
  };
}

module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark
};
