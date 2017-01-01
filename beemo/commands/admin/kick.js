module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToBan = message.guild.member(message.mentions.users.first());

        if(typeof memberToBan == 'undefined') {
            message.reply("Invalid member.");
            return;
        }
        try {
            await memberToBan.kick();
            message.reply(":ok_hand:");
        } catch (err) {
            message.reply("Unable to kick, do I have the correct permissions?");
        }
    },
    help: 'Kicks a member',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<mention>'
};