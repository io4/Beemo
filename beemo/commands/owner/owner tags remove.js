module.exports = {
	main: async (bot, message, user, tag, ...args) => {
		var user = bot.resolve.user(message);

		await bot.redis.sremAsync(`user:${user.id}:tags`, tag);
		message.reply(":ok_hand:")
	},
	help: "Removes an internal tag",
	args: "[@user] [tag]",
	ownerOnly: true
}