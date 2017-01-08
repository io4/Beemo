module.exports = {
    MUTE_ROLE: 'BeemoMuted',
    main: async (bot, message, ...args) => {
    	let memberToMute = message.guild.member(bot.resolve.user(message));
        if (typeof memberToMute == 'undefined') {
            message.reply("Invalid member.");
            return;
        }
        let mutedRole message.guild.roles.find('name', this.MUTE_ROLE);
        if (!mutedRole) {
            try {
                mutedRole = await message.guild.createRole({
                    hoist: false,
                    name: this.MUTE_ROLE,
                    permissions: [],
                    mentionable: false
                });
                try {
                    for (let channel of message.guild.channels.values()) {
                        this.applyMute(channel, mutedRole);
                    }
                } catch (err) {
                    message.reply('Unable to set channel permissions, please check channel permissions for the "'+this.MUTE_ROLE+'" role.');
                }
            } catch(err) {
                message.reply("Unable to create role, do I have the correct permissions?");
            }
        }
        try {
            await memberToMute.addRole(mutedRole);
        } catch (err) {
            message.reply("Unable to add user to muted role, do I have the correct permissions?");
        }
        message.reply(":ok_hand:");
    },
    applyMute: async (chan, role) => {
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
    },
    onChannelCreate: async (client, channel) => {
        let mutedRole = channel.guild.roles.find('name', this.MUTE_ROLE);
        if (!mutedRole) return;
        try {
            this.applyMute(channel, mutedRole);
        }
    },
    help: 'Mute a member',
    guildOnly: true,
    roleRequired: 'Beemo Admin',
    args: '<mention|id|username>'
};
