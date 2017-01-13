'use strict';
// support reloading of the helper
delete require.cache[require.resolve('./util/capitalismHelper.js')];
const capitHelper = require("./util/capitalismHelper.js");
const Discord = require("discord.js");
/* ================================================
HEY MOONY
THIS IS KINDA IMPORTANT!!!!!
So, you're parsing strings into integers with parseInt, right?
Problems:
    > parseInt('1e5')
    1
scientific notation (or whatever) doesn't parse properly
    > parseInt('12asdf')
    12
it completely ignores problems with the string
THE FIX:
First, isNaN actually works with strings.
    > isNaN('12asdf')
    true
    > isNaN('asdf')
    true
    > isNaN('1e100')
    false
    > isNaN('-500')
    false
Quite well, too.
Second of all, +<string> does much better than parseInt.
    > +'-500'
    -500
    > +'1e+100'
    1e+100
    > +'1+3'
    NaN
    > +'12asdf'
    NaN
In fact, you can even replace the string with a variable.
    > var efef = '1234';
    undefined
    > +efef
    1234
It even recognizes undefined!
    > var efef = undefined;
    undefined
    > +efef
    NaN
See? WAY better than parseInt.
NOTE: this also parses floats, so you might need Math.floor()
Just a friendly bit of advice, I'm not trying to be offensive.

I'm going to try to fix much of that, though don't expect me
to finish before you get back on tomorrow or something. Just
saying.

Some other problems in this file:
1. item names are case-sensitive
2. you probably don't need break after a return in a switch()
================================================ */
module.exports = {
    main: async (bot, message, ...args) => {
        let user = await capitHelper.getUser(message.author);
        switch (args[0].toLowerCase()) { 
            case 'list':
                return `You can buy the following: ${await capitHelper.listItems(message.author,true)}`;
            case 'buy':
                if (capitHelper.itemExists(args[1]) && user.cashAllTime >= capitHelper.items[args[1]].cost && capitHelper.items[args[1]].instock == true) {
                    if (capitHelper.items[args[1]].cost > user.cash) {
                        return "You cannot afford that!";
                    }
                    var num = Math.floor(+args[2]);
                    if (num) {
                        if ((capitHelper.items[args[1]].cost * num) > user.cash) {
                            return "You cannot afford that!";
                        }
                        
                        await capitHelper.takeCash(message.author,(capitHelper.items[args[1]].cost * num)),
                        await capitHelper.addItem(message.author,args[1],num)
                        
                        return `You bought ${num} ${args[1]}s`;
                    } else {
                        
                        await capitHelper.takeCash(message.author,capitHelper.items[args[1]].cost),
                        await capitHelper.addItem(message.author,args[1])
                        message.reply(capitHelper.items[args[1]].cost); // DEBUG
                        return `You bought a ${args[1]}`;
                    }
                } else return 'That item does not exist!';
            case 'sell':
                if (capitHelper.itemExists(args[1]) && user.inv[args[1]]) {
                    var num = Math.floor(+args[2]);
                    if (num) {
                        if (await capitHelper.removeItem(message.author,args[1],num)) {
                            return `You dont have enough ${args[1]}`;
                        }
                        await capitHelper.giveCash(message.author,(capitHelper.items[args[1]].cost * num));
                        return `You sold ${num} ${args[1]}s`;
                    } else {
                        if (await capitHelper.removeItem(message.author,args[1])) {
                            return `You dont have enough ${args[1]}`;   
                        }
                        await capitHelper.giveCash(message.author,capitHelper.items[args[1]].cost);
                        message.reply(capitHelper.items[args[1]].cost); // DEBUG
                        return `You sold a ${args[1]}`;
                    }
                } else return 'That item does not exist, or you do not have it.';
            case 'info':
                if (capitHelper.itemExists(args[1])) {
                    return `Info about ${args[1]}: ${capitHelper.items[args[1]].info}`;
                } else return 'No such item.';
            default:
                message.reply("Store has a few subcommands, they are 'buy <item> [amount]', 'sell <item> [amount]', 'info <item>' and 'list'. ");
        }
    },
    help: "Do things at the store!",
    args: "[subcommand] [arguments]"
};