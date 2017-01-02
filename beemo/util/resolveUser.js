module.exports = (msg, selfErr = false) => {
	var userreg = new RegExp(/<@!?([0-9]{17,21})>/);
	var userreg2 = new RegExp(/id\:([0-9]{17,21})/);
	var input = msg.content;
	var userid = input;
	if (userreg.test(input)) {
		var reg = userreg.exec(input);
		userid = reg[1];
	} else if (userreg2.test(input)) {
		userid = userreg2.exec(input)[1];
	} else if (msg.client.users.find(`username`, msg.content.replace(`@`, ``)) !== null) {
		userid = msg.client.users.find(`username`, msg.content.replace(`@`, ``)).id;
	} else if (!msg.content && selfErr !== false) userid = msg.author.id;

	var user = msg.client.users.get(userid);
	if (user == undefined) {
		return false;
	} else {
		return user;
	}

}
