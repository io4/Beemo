module.exports = async client => {
	client.chatSessions = {};
	client.commandManager.unloadCommands();
	client.commandManager.loadCommands();
}