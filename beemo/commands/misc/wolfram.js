var wolfram = require('wolfram-alpha');
const Discord = require("discord.js");

module.exports = {
    main: async (bot, message, ...args) => {
    	var wolframInstance = bot.wolframInstances[Math.floor(Math.random()*bot.wolframInstances.length)];

    	wolframInstance.query(message.content, function(err, result) {
            try {
        		if(err != null) {
        			message.reply("An error occurred.");
        			bot.error(`Wolfram error: ${err}`);
        			return;
        		}

        		///bot.log(result[1].subpods);
                const embed = new Discord.RichEmbed();

                embed.setColor('#2ecc71');

                for(var output of result) {
                    //ignore the interpretation
                    if(output.title == 'Input interpretation') {
                        continue;
                    }

                    //format subpods
                    var subpods = "";
                    for(var subpod of output.subpods) {
                        if(subpod.text != "") {
                            subpods += `\`${subpod.text}\`\n`;
                        }
                        if(subpod.image) {
                            embed.setImage(subpod.image);
                        }
                    }

                    if(subpods.length == 0) {
                        continue;
                    }

                    if(!(subpods.length > 1000)) {
                        embed.addField(output.title, subpods, true);
                    }
                }

                message.channel.sendEmbed(embed);
            } catch (err) {
                bot.error(`Error running wolfram command: ${err}`);
            }
    	});
    },
    onLoad: (bot) => {
    	bot.wolframInstances = [];

    	for(var wolframKey of bot.credentials.commands.wolfram.keys) {
    		bot.wolframInstances.push(wolfram.createClient(wolframKey));
    	}
    },
    help: 'Ask wolfram something',
    args: '<query>'
};