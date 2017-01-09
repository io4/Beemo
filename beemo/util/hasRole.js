module.exports = (message, ...roleNames) => {

	if(message.member.id == message.guild.owner.id) {
		return true;
	}

	if(!message.guild) {
		return false;
	}

	for(var roleName in roleNames) {
		var roleName = roleNames[roleName];
		let role = message.guild.roles.find("name", roleName);
		if(role != null){
			if(message.member.roles.has(role.id)) {
				return true;
			}
		}
	}
	return false;
}