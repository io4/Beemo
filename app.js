const Discord = require('discord.js');
const chalk = require('chalk');
const credentials = require('./credentials.json');
var serverCount = 0;
const website = require("./website/web.js");
var io = website.io;

website.server.listen(process.env.PORT||8080);
const manager = new Discord.ShardingManager('beemo/shard.js', {
	totalShards: credentials.shardCount,
	respawn: false,
	token: credentials.token
});

manager.log = (...args) => console.log('🔰', chalk.yellow.bold('MANAGER'), ...args);

manager.on('launch', id => manager.log(`Launched Shard ${id.id+1}/${manager.totalShards}`));

//Start it up
manager.spawn();

setInterval(_=>{
manager.fetchClientValues('guilds.size').then(results => {
  serverCount = results.reduce((prev, val) => prev + val, 0);
  io.emit("serverCount", serverCount);
}).catch(console.error);
},1000);

io.on('connection', function (socket) {
  socket.emit("serverCount", serverCount); // Quickly reply value in cache
});
