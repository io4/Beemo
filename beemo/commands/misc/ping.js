module.exports = {
    main: async (bot, message, ...args) => {
    	var lag = new Date().getTime();
        ping_message = await message.channel.sendMessage('ping...');
        var now = new Date().getTime();

        await ping_message.edit(`Pong \`${now-lag}ms\``);

    },
    help: 'Pong!'
};