const speedTest = require('speedtest-net');
module.exports = {
	main : (bot, msg) => {
    	msg.channel.sendMessage("A speedtest is now in progress. Please wait 15 seconds.")
    	const test = speedTest({maxTime: 5000});
    	test.on("data", data => {
        	msg.channel.sendMessage("**__SPEEDTEST RESULTS__**\n\n" +
        	"**Server**\n" +
        	"Country: " +  data.server.country + "\n" +
        	"Location: " + data.server.location + "\n" +
        	"**Speed**\n" +
        	"Ping: " + (data.server.ping).toFixed(0) + "ms\n" +
        	"Download: " + (data.speeds.download).toFixed(2) + " Mbit/s\n" +
        	"Upload: " + (data.speeds.upload).toFixed(2) + " Mbit/s")
    	})
	},
	help: 'Performs a connection speedtest!',
	ownerOnly: true
}
