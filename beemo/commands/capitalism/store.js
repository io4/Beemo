'use strict';
const capitHelper = require("./util/capitalismHelper.js");
const Discord = require("discord.js");
module.exports = {
    main: async (bot, message, ...args) => {
        let user = await capitHelper.getUser(message.author);
        switch (args[0].toLowerCase()) { 
            case 'list':
                return `You can buy the following: ${await capitHelper.listItems(message.author,true)}`;
                break;
            case 'buy':
                if (capitHelper.itemExists(args[1]) && user.cashAllTime >= capitHelper.items[args[1]].cost && capitHelper.items[args[1]].instock == true) {
                    if (capitHelper.items[args[1]].cost > user.cash) {
                        return "You cannot afford that!";
                    }
                    if (!isNaN(parseInt(args[2])) && typeof args[2] != 'undefined') {
                        if ((capitHelper.items[args[1]].cost * parseInt(args[2])) > user.cash) {
                            return "You cannot afford that!";
                        }
                        await capitHelper.takeCash(message.author,(capitHelper.items[args[1]].cost * parseInt(args[2])));
                        await capitHelper.addItem(message.author,args[1],parseInt(args[2]));
                        return `You bought ${args[2]} ${args[1]}s`;
                    } else {
                        await capitHelper.takeCash(message.author,capitHelper.items[args[1]].cost);
                        message.reply(capitHelper.items[args[1]].cost);
                        await capitHelper.addItem(message.author,args[1]);
                        return `You bought a ${args[1]}`;
                    }
                } else {
                    return 'That item does not exist!';
                }
                break;
            case 'sell':
                if (capitHelper.itemExists(args[1]) && user.inv[args[1]]) {
                    
                    if (!isNaN(parseInt(args[2])) && typeof args[2] != 'undefined') {
                        
                        await capitHelper.giveCash(message.author,(capitHelper.items[args[1]].cost * parseInt(args[2])));
                        if (await capitHelper.removeItem(message.author,args[1],parseInt(args[2]))) {
                            return `You dont have enough ${args[1]}`;
                        }
                        return `You sold ${args[2]} ${args[1]}s`;
                    } else {
                        await capitHelper.giveCash(message.author,capitHelper.items[args[1]].cost);
                        message.reply(capitHelper.items[args[1]].cost);
                        if (await capitHelper.removeItem(message.author,args[1])) {
                            return `You dont have enough ${args[1]}`;   
                        }
                        return `You sold a ${args[1]}`;
                    }
                } else {
                    return 'That item does not exist or you do not have it!';
                }
                break;
            case 'info':
                if (capitHelper.itemExists(args[1])) {
                    return `Info about ${args[1]}: ${capitHelper.items[args[1]].info}`;
                }
                break;
            default:
                message.reply("Store has a few subcommands, they are 'buy <item> [amount]', 'sell <item> [amount]', 'info <item>' and 'list'. ");
        }
    },
    help: "Do things at the store!",
    args: "[subcommand] [arguments]"
};