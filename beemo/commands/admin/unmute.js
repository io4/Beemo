var MUTE_ROLE = 'BeemoMuted';

module.exports = {
    main: async (bot, message, ...args) => {
        let memberToUnmute = message.guild.member(bot.resolve.user(message));
        if (typeof memberToUnmute == 'undefined') {
            message.reply("Invalid member.");
            return;
        }
        let mutedRole = message.guild.roles.find('name', MUTE_ROLE);
        if (!mutedRole) {
            message.reply("The muted role doesn't exist, how could that user possibly be muted?");
            return;
        }
        try {
            await memberToUnmute.removeRole(mutedRole);
        } catch(err) {
            message.reply("Unable to remove user from muted role, do I have the correct permissions?");
            return;
        }
        message.reply(":ok_hand:");
    },
    help: 'Unmute a member',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<mention|id|username>'
};
