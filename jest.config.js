module.exports = {
  transform: { "^.+\\.ts?$": "ts-jest" },
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  cacheDirectory: ".jest-cache"
};
