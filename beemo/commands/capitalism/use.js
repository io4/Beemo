// support reloading of the helper
delete require.cache[require.resolve('./util/capitalismHelper.js')];
const capitHelper = require("./util/capitalismHelper.js");
const Discord = require("discord.js");
module.exports = {
    main: async (bot, message, ...args) => {
        if (!args[0]) {
            message.reply("You can't use an empty string!"); // lol
            return;
        }
        let user = await capitHelper.getUser(message.author);
        if (await capitHelper.itemExists(args[0]) && user.inv[args[0]]) {
            if(capitHelper.items[args[0]].func) {
                await capitHelper.items[args[0]].func(message,bot,capitHelper);
            } else {
                message.channel.sendEmbed({description: '<:gold:251238233453625345> ${message.author} discord gold required to use this item <:gold:251238233453625345>'})
            }
        } else {
            message.reply("That item doesnt exist.");
        }
    },
    help: "Use items, I wonder what they do...",
    args: "<item>"
}
