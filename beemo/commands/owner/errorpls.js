module.exports = {
  main: async (bot, message, ...args) => {
    throw new Error("Here's the error you wanted");
  },
  help: 'Nice error',
  hidden: true,
  ownerOnly: true
};
