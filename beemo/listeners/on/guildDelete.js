const sendCount = require("../../util/sendCount.js");

module.exports = async (client, guild) => {
	await sendCount(client);
}