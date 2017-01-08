module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToKick = message.guild.member(bot.resolve.user(message));

        if(typeof memberToKick == 'undefined') {
            message.reply("Invalid member.");
            return;
        }
        try {
            var voiceChannel = await message.guild.createChannel('vckick', 'text');
            await memberToKick.setVoiceChannel(voiceChannel);
            await voiceChannel.delete();
            message.reply(":ok_hand:");
        } catch (err) {
            bot.log(err);
            message.reply("Unable to kick, do I have the manage channels/move members permissions?");
        }
    },
    help: 'Kicks a member from a voice channel',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<mention|id|username>'
};
