module.exports = { // thanks for the cool code cat
	user: (text, client, caseSensitive = false) => {
		 let users = client.users;

        let reg = /<@!?(\d+)>/;
        if (reg.test(text)) {
            let id = text.match(reg)[1];
            return users.get(id);
        }

        let check = u => {
            let username = caseSensitive ? u.username : u.username.toLowerCase();
            let t = caseSensitive ? text : text.toLowerCase();

            return username === t || username === t.split('#')[0] && u.discriminator === t.split('#')[1];
        };
        let checkInc = u => {
            let username = caseSensitive ? u.username : u.username.toLowerCase();
            let t = caseSensitive ? text : text.toLowerCase();

            return username.includes(t) || username.includes(t.split('#')[0]) && u.discriminator.includes(t.split('#')[1]);

        };
        return users.get(text) || users.find(check) || users.find(checkInc);
	},
	member: (text, guild, caseSensitive = false) => {
        let members = guild.members;

        let reg = /<@!?(\d+)>/;
        if (reg.test(text)) {
            let id = text.match(reg)[1];
            return members.get(id);
        }

        let check = m => {
            let username = caseSensitive ? m.user.username : m.user.username.toLowerCase();
            let displayName = caseSensitive ? m.displayName : m.displayName.toLowerCase();
            let t = caseSensitive ? text : text.toLowerCase();

            return displayName === t || username === t || username === t.split('#')[0] && m.user.discriminator === t.split('#')[1];
        };
        let checkInc = m => {
            let username = caseSensitive ? m.user.username : m.user.username.toLowerCase();
            let displayName = caseSensitive ? m.displayName : m.displayName.toLowerCase();
            let t = caseSensitive ? text : text.toLowerCase();

            return displayName.includes(t) || username.includes(t) || username.includes(t.split('#')[0]) && m.user.discriminator.includes(t.split('#')[1]);

        };

        return members.get(text) || members.find(check) || members.find(checkInc);
    },
	num: (content) => {
		const regex = new RegExp(/([0-9]*)/);
		if (regex.test(content)) {
			let num = parseInt(content);
			if (num == NaN) {
				return false;
			}
			return num;
		} else {
			return false;
		}
	},
	role: (text, guild, caseSensitive = false) => {
         if (!guild) throw new Error('Guild must be specified.');

        let roles = guild.roles;

        let reg = /<@&(\d+)>/;
        if (reg.test(text)) {
            let id = text.match(reg)[1];
            return roles.get(id);
        }

        let check = r => {
            let name = caseSensitive ? r.name : r.name.toLowerCase();
            let t = caseSensitive ? t : text.toLowerCase();

            return name === t || name === t.replace(/^@/, '');
        };
        let checkInc = r => {
            let name = caseSensitive ? r.name : r.name.toLowerCase();
            let t = caseSensitive ? text : text.toLowerCase();

            return name.includes(t) || name.includes(t.replace(/^@/, ''));

        };

        return roles.get(text) || roles.find(check) || roles.find(checkInc);
};
