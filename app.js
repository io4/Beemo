const Discord = require('discord.js');
const chalk = require('chalk');
const credentials = require('./credentials.json');

const manager = new Discord.ShardingManager('beemo/shard.js', {
	totalShards: credentials.shardCount,
	respawn: false,
	token: credentials.token
});

manager.log = (...args) => console.log('🔰', chalk.yellow.bold('MANAGER'), ...args);

manager.on('launch', id => manager.log(`Launched Shard ${id.id+1}/${manager.totalShards}`));

//Start it up
manager.spawn();
