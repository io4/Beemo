module.exports = async client => {
	client.cleverBotSessions = {};
	client.commandManager.unloadCommands();
	client.commandManager.loadCommands();
}