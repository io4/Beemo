module.exports = {
    main: async (bot, message, ...args) => {
        return `pong \`${Math.round(bot.ping)}ms\``;
    },
    help: 'Pong!'
};