module.exports = async client => {
	client.commandManager.unloadCommands();
	client.commandManager.loadCommands();
}