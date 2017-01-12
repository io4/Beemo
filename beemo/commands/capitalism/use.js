const capitHelper = require("./util/capitalismHelper.js");
const Discord = require("discord.js");
module.exports = {
    main: async (bot, message, ...args) => {
        let user = await capitHelper.getUser(message.author);
        if (capitHelper.itemExists(args[0]) && user.inv[args[0]]) {
            if(capitHelper.items[args[0]].func) {
                capitHelper.items[args[0]].func(message,bot);
            } else {
                message.reply("Nothing happened.");
            }
        } else {
            message.reply("That item doesnt exist.");
        }
    },
    help: "Use items, I wonder what they do...",
    args: "<item>"
}