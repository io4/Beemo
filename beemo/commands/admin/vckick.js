module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToKick = bot.resolve.member(message.content, message.guild);

        if(!memberToKick) {
            message.reply("Invalid member.");
            return;
        }
        try {
            var voiceChannel = await message.guild.createChannel('vckick', 'voice');
            await memberToKick.setVoiceChannel(voiceChannel);
            await voiceChannel.delete();
        } catch (err) {
            message.reply("Unable to kick, do I have the manage channels/move members permissions?");
            return;
        }
        message.reply(":ok_hand:");
    },
    help: 'Kicks a member from a voice channel',
    guildOnly: true,
    permissionRequired: 'KICK_MEMBERS',
    args: '<mention|id|username>'
};
