var MUTE_ROLE = "BeemoMuted";

async function applyMute (chan, role) {
    if (chan.type == 'text') {
        await chan.overwritePermissions(role, {
            'SEND_MESSAGES': false,
            'SEND_TTS_MESSAGES': false
        });
    } else if (chan.type == 'voice') {
        await chan.overwritePermissions(role, {
            'SPEAK': false
        });
    }
}

module.exports = {
    main: async (bot, message, ...args) => {
    	let memberToMute = message.guild.member(bot.resolve.user(message));
        if (typeof memberToMute == 'undefined') {
            message.reply("Invalid member.");
            return;
        }
        let mutedRole = message.guild.roles.find('name', MUTE_ROLE);
        if (!mutedRole) {
            try {
                mutedRole = await message.guild.createRole({
                    hoist: false,
                    name: MUTE_ROLE,
                    permissions: [],
                    mentionable: false
                });
                try {
                    for (let channel of message.guild.channels.values()) {
                        applyMute(channel, mutedRole);
                    }
                } catch (err) {
                    message.reply('Unable to set channel permissions, please check channel permissions for the "'+MUTE_ROLE+'" role.');
                    return;
                }
            } catch(err) {
                message.reply("Unable to create role, do I have the correct permissions?");
                return;
            }
        }
        try {
            await memberToMute.addRole(mutedRole);
        } catch (err) {
            message.reply("Unable to add user to muted role, do I have the correct permissions?");
            return;
        }
        message.reply(":ok_hand:");
    },
    onChannelCreate: async (client, channel) => {
        let mutedRole = channel.guild.roles.find('name', MUTE_ROLE);
        if (!mutedRole) return;
        try {
            applyMute(channel, mutedRole);
        } catch(err) {}
    },
    help: 'Mute a member',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<mention|id|username>'
};
