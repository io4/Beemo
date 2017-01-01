module.exports = {
  main: async (bot, message, ...args) => {
    //Set avatar
    bot.user.setAvatar(message.content);
  },
  help: 'Sets the bots avatar',
  hidden: true,
  ownerOnly: true,
  args: '<url of avatar>'
};