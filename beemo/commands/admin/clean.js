module.exports = {
    main: async (bot, message, limit, ...args) => {
        let limit = bot.resolve.num(limit);
        if(!limit) {
            limit = 100;
        }

        let messages = await message.channel.fetchMessages({limit});

        const user = bot.resolve.user(message);
        if(user) {
            messages = messages.array().filter(m => m.author.id === user.id)
        }

        try {
            message.channel.bulkDelete(messages);
        } catch (err) {
            message.reply("I don't have the Manage Messages permission.");
        }
    },
    help: 'Delete channel messages',
    guildOnly: true,
    permissionRequired: 'MANAGE_MESSAGES',
    args: '[limit] [user]'
};
