module.exports = { // thanks for the cool code cat
	user: (msg, selfErr = false) => {
		const userreg = new RegExp(/<@!?([0-9]{17,21})>/);
		const userreg2 = new RegExp(/id\:([0-9]{17,21})/);
		let input = msg.content;
		let userid = input;
		if (userreg.test(input)) {
			let reg = userreg.exec(input);
			userid = reg[1];
		} else if (userreg2.test(input)) {
			userid = userreg2.exec(input)[1];
		} else if (msg.client.users.find(`username`, msg.content.replace(`@`, ``)) !== null) {
			userid = msg.client.users.find(`username`, msg.content.replace(`@`, ``)).id;
		} else if (!msg.content && selfErr !== false) userid = msg.author.id;

		const user = msg.client.users.get(userid);
		if (user == undefined) {
			return false;
		} else {
			return user;
		}

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
	role: (msg, selfErr = false) => {
        const input = msg.content;
        let roleid = input;
        if (msg.mentions.roles.array().length > 0) {
            roleid = msg.mentions.roles.array()[0].id;
        } else if (msg.guild.roles.find(r => r.id.includes(input))) {
            roleid = input;
        } else if (msg.guild.roles.find(r => r.name.includes(input))) {
            roleid = msg.guild.roles.find(r => r.name.includes(input)).id;
        } else if (selfErr) roleid = msg.member.highestRole.id;

        var role = msg.guild.roles.get(roleid);
        if (role == undefined) {
            return false;
        } else {
            return role;
        }
    }
};
