'use strict';
// support reloading of the helper
delete require.cache[require.resolve('./util/capitalismHelper.js')];
const capitHelper = require("./util/capitalismHelper.js");
const Discord = require("discord.js");
module.exports = {
    main: async (bot, message, ...args) => {
        //let invToSee = message.guild.member(bot.resolve.user(message));
        
        //if (typeof invToSee == 'undefined') {
            await capitHelper.safeMakeData(message.author);
            let user = await capitHelper.getUser(message.author);
            message.reply(`Info: ${user} Info: ${await message.author.redis.getAsync('capitalism_userData')}`);
            const embed = new Discord.RichEmbed();
            embed.setTitle(`${message.author.username}\'s inventory`);
            embed.setAuthor(bot.user.username, bot.user.avatarURL);
            embed.setDescription(`${message.author.username}\'s inventory`);
            embed.setColor('#2ecc71');
            embed.setThumbnail(bot.user.avatarURL);
            embed.addField('Cash', user.cash, true);
            embed.addField('All Time Cash', user.cashAllTime, true);
            embed.addField('All Time Cash Spent', user.cashLostAT, true);
            embed.addField('Items', await capitHelper.listItems(message.author), true);
            message.channel.sendEmbed(embed);
        //} else {
            
        //}
    },
    help: "View your or someone else's Capitalism statistics and inventory.",
    args: "[mention|id|username]",
}