const Discord = require("discord.js");

module.exports = {
    main: async (bot, message, ...args) => {
        //help <command>
        if(message.content != "") {
            //get the command
            for(var command_name in bot.commandManager.commands) {
                var command = bot.commandManager.commands[command_name];

                if(command.name == message.content) {

                    const embed = new Discord.RichEmbed();
                    embed.setTitle(`${bot.credentials.prefixes[0]}${command_name}`);
                    embed.setAuthor(bot.user.username, bot.user.avatarURL);
                    if(command.help) embed.setDescription(command.help);
                    embed.setColor('#2ecc71');
                    embed.setThumbnail(bot.user.avatarURL);
                    embed.addField('Command', command.name, true);

                    //Optional things
                    if(typeof command.roleRequired != 'undefined') {
                        embed.addField('Role Required', command.roleRequired, true);
                    }

                    if(typeof command.ownerOnly != 'undefined') {
                        embed.addField('Owner command', command.ownerOnly, true);
                    }

                    if(typeof command.args != 'undefined') {
                        embed.addField('Arguments', `\`${bot.credentials.prefixes[0]}${command_name} ${command.args}\``, true);
                    }

                    if(typeof command.guildOnly != 'undefined') {
                        embed.addField('Guild Only?', command.guildOnly, true);
                    }

                    return embed;
                }
            }
            message.reply("Command not found");
        } else {
/*    	   help_message = `**${bot.credentials.description}** (do ${bot.credentials.prefixes[0]}help <command> for per command help)\n\n`;

        	for(var command_name in bot.commands) {
        		var command = bot.commands[command_name];

        		if(command.hidden == true) {
        			continue;
        		}

        		help_message += `**${bot.credentials.prefixes[0]}${command_name}**`;

        		if(typeof command.help != 'undefined') {
        			help_message += ` : ${command.help}`;
        		}

        		help_message += "\n";
        	}

        	message.author.sendMessage(help_message);*/
            //Lets get all categories as a dict first
            const categories = {};
            for(const commandName in bot.commandManager.commands) {
                const command = bot.commandManager.commands[commandName];
                if(command.hidden) continue;
                if(typeof categories[command.category] == 'undefined') {
                    categories[command.category] = [command];
                } else {
                    categories[command.category].push(command);
                }
            }

            const embed = new Discord.RichEmbed();
            embed.setTitle('Commands');
            embed.setDescription(`Do \`${bot.credentials.prefixes[0]}help <command>\` for extended command infomation`);
            embed.setColor('#2ecc71');
            embed.setAuthor(bot.user.username, bot.user.avatarURL);
            embed.setThumbnail(bot.user.avatarURL);

            for(var category in categories) {
                var categoryCommands = "";
                for(var command of categories[category]) {
                    categoryCommands += `\`${bot.credentials.prefixes[0]}${command.name}\`\n`;
                }
                embed.addField(category, categoryCommands, true);
            }

            message.author.dmChannel.sendEmbed(embed);
        }
    },
    help: 'Returns this message.',
    args: '[command]',
    cacheResult: true,
    hidden: true
};
