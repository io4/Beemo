const Discord = require("discord.js");
const chalk = require("chalk");
const bluebird = require("bluebird");
const redis = require('redis');
const hasRole = require("./util/hasRole.js");
const injectClient = require("./util/injectClient.js");

//Manager Requires
const listenerManager = require('./managers/listenerManager.js');
const commandManager = require('./managers/commandManager.js');
const redisManager = require('./managers/redisManager.js');
const prefixManager = require('./managers/prefixManager.js');

//promisify
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const credentials = require('../credentials.json');
const client = new Discord.Client({
  shardId: process.argv[2],
  shardCount: process.argv[3],
  disableEveryone: true
});


client.log = (...args) => console.log('🔧', chalk.green.bold(`SHARD ${client.shard.id + 1}/${client.shard.count}`), ...args);
client.error = (...args) => console.error(chalk.bgRed.white.bold('🔥', `SHARD ${client.shard.id + 1}/${client.shard.count}`), ...args);
client.resolve = require(`./util/resolve.js`);
client.credentials = credentials;
client.botVersion = "Beemo v3.0.0";

if(credentials.distribution != "DEBUG") {
	process.on('unhandledRejection', (reason, promise) => {
		if(reason == "Error: Forbidden" || reason == "Error: Bad Request") return;
		client.error(`Unhandled Rejection: ${reason}`);
	});
}


//Managers

client.listenerManager = new listenerManager(client);
client.commandManager = new commandManager(client);
client.redisManager = new redisManager(client);
client.prefixManager = new prefixManager(client);

client.listenerManager.loadListeners();
client.redis = client.redisManager.redis;

//Start it up
client.login(credentials.token).catch(client.error);
