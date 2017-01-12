module.exports = {
    main: async (bot, message, ...args) => {
        message.author.redis.delAsync("capitalism_userData");
        message.reply("is now starting fresh once more!")
    },
    help: "Restart on capitalism. the only reason you would use this is due to a almighty flop.",
}