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
		} else if (selfErr) userid = msg.author.id;

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
	role: (msg, caseSensitive = false) => {
        const text = msg.content;
        let roles = msg.guild.roles;

        let reg = /<@&(\d+)>/;
        if (reg.test(text)) {
            let id = text.match(reg)[1];
            return roles.get(id);
        }

        let check = r => {
            let name = caseSensitive ? r.name : r.name.toLowerCase();
            let t = caseSensitive ? t : text.toLowerCase();

            return name.includes(t) || name.includes(t.replace(/^@/, ''));
        };

        return roles.get(text) || roles.find(check);
    }
};
