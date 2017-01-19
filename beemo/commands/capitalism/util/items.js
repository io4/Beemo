'use strict';

module.exports = {
    "spacetime-tear": {
        name:"spacetime-tear",
        cost: -999999999999999999999,
        info: "God help you.",
        amount: 1,
        instock:false,
        func: async (message,bot,helper) => {
            
        }
    },
    "paradox": {
        name: "paradox",
        cost: -5000000000000,
        info: "Game over for you, buddy",
        amount: 1,
        instock: false
    },
    "blackhole": {
        name: "blackhole",
        cost: -50000000000,
        info: "OH MY GOD, GET RID OF IT NOW",
        amount: 1,
        instock: false
    },
    "loan": {
        name: "loan",
        cost: -500000000,
        info: "Why would you take out such a large loan.. better get rid of it fast (it grows)",
        amount: 1,
        instock: false
    },
    "credit": {
        name: "credit",
        cost: -5000000,
        info: "You owe somebody a lot of money",
        amount: 1,
        instock: false
    },
    "void": {
        name: "void",
        cost: -50000,
        info: "Watch out, this will take money with it!",
        amount: 1,
        instock: false
    },
    "junk": {
        name: "junk",
        cost: -500,
        info: "Why do you have this, you will have to PAY someone to get rid of it",
        amount: 1,
        instock: false
    },
    "powder": {
        name: "powder",
        cost: 5,
        info: "It's some kind of powder...",
        amount: 1,
        instock: true
    },
    "lemonade": {
        name: "lemonade",
        cost: 50,
        info: "Your very own Pocket Lemonade Stand 9001",
        amount: 1,
        instock: true,
        func: async (message,bot,helper) => {
            var x = helper.randInt(1,10*(Math.min((await helper.getUser(message.author)).inv["lemonade"],20)));
            message.reply(`You sell some lemonade, earning ${x} dollars (+${x} cash)`);
            await helper.giveCash(message.author, x);
            return;
        }
    },
    "chips": {
        name: "chips",
        cost: 50,
        info: "Baked Lays.",
        amount: 1,
        instock: true,
        func: async (message,bot,helper) => {
            switch (parseInt(helper.weightedRand({0:1,1:0.3})())) { // for some reason it returns a string.
                case 0:
                    message.reply(`eats a bag of chips ([${message.author.username}] -1 chips +1 junk)`);
                    await helper.removeItem(message.author,'chips');
                    await helper.addItem(message.author,'junk');
                    break;
                case 1:
                    let x = helper.randInt(1,10);
                    message.reply(`gets inspired by the chips and bakes some more! ([${message.author.username}] +${x} chips)`)
                    await helper.addItem(message.author,'chips',x);
                    break;
                default:
                    message.reply('Your chips throw a error, as the weighted randomiser goof\'d. (please report this.)');
                    break;
            }
        }
    },
    "shoe": {
        name: "shoe",
        cost: 200,
        info: "One shoe, why is there only one?",
        amount: 1,
        instock: false
    },
    "ipad": {
        name: "ipad",
        cost: 499,
        info: "A new iPad.",
        amount: 1,
        instock: true,
        func: async (message,bot,helper)=>{
            var user = await helper.getUser(message.author);
            switch (parseInt(helper.weightedRand({0:1,1:0.2})())) {
                case 0:
                    var valids = await helper.randBuyValids(user);
                    var x = helper.randInt(0,valids.length-1);
                    var cost = helper.randInt(valids[x].cost-(valids[x].cost/2),valids[x].cost+(valids[x].cost/2));
                    if (cost > user.cash) {
                        message.reply(`You couldn't afford to buy ${valids[x].name} on E-Bay for ${cost}`);
                    } else {
                        await helper.takeCash(message.author,cost);
                        await helper.addItem(message.author,valids[x].name);
                        message.reply(`You bought a ${valids[x].name} for ${cost} on E-Bay`);
                    }
                    break;
                case 1:
                    message.reply(`'s ipad broke! ([${message.author.username}] -1 ipad)`);
                    await helper.removeItem(message.author,'ipad');
                    break;
            }
        }
    },
    "table": {
        name: "table",
        cost: 700,
        info: "The fanciest table around!",
        amount: 1,
        instock: true,
        func: async (message,bot,helper)=>{
            switch (parseInt(helper.weightedRand({0:1,1:0.3,2:0.01})())) {
                case 0:
                    message.reply('You flip the table.  \`(╯°□°）╯︵ ┻━┻\`');
                    break;
                case 1: 
                    message.reply('You flip the table and it breaks!  \`(╯°□°）╯︵ ┻ ┻ \` (-1 table)');
                    await helper.removeItem(message.author,'table');
                    break;
                case 2:
                    let rand = helper.randInt(1000,2000);
                    message.reply(`Your table turns out to be a ancient relic, you sell it on Ebay for ${rand} (+${rand} cash)`);
                    Promise.all([
                        helper.removeItem(message.author,'table'),
                        helper.giveCash(message.author,rand)
                    ]);
                    break;
                default:
                    message.reply('Your table throws a error, as the weighted randomiser goofed. (please report this.)');
                    break;
            }
        }
    },
    "lamp": {
        name: "lamp",
        cost: 1001,
        info: "A very expensive lamp, great lighting.",
        amount: 1,
        instock: true,
        func: async (message,bot,helper) => {
            switch (parseInt(helper.weightedRand({0:1,1:0.01,2:0.1})())) {
                case 0: 
                    message.reply("You turn the lamp off and on again.");
                    break;
                case 1:
                    message.reply("'s lamp breaks into a billion pieces (-1 lamp, +1 billion)");
                    await helper.removeItem(message.author,'lamp');
                    await helper.addItem(message.author,'billion');
                    break;
                case 2:
                    message.reply("'s lamp does a little jig: https://www.youtube.com/watch?v=SI1fOIgXkaU");
                    break;
            }
        }
    },
    "penguin": {
        name: "penguin",
        cost: 5000,
        info: "Don't forget to feed it.",
        amount: 1,
        instock: false,
        func: async (message,bot,helper) => {
            switch (parseInt(helper.weightedRand({0:1,1:0.1,2:0.1})())) {
                case 0:
                    message.reply(" feeds his penguin");
                    break;
                case 1:
                    message.reply(" has a penguin roast (-1 penguin)");
                    await helper.removeItem(message.author, 'penguin');
                    break;
                case 2:
                    var x = (await helper.getUser(message.author)).inv['penguin'];
                    await helper.addItem(message.author,'penguin',x)
                    message.reply(`'s penguin(s) multiply! (+${x} penguins)`);
                    break;
            }
        }
    },
    "nothing": {
        name: "nothing",
        cost: 10000,
        info: "Nothing, how can you even have this.",
        amount: 1,
        instock: false
    },
    "cat": {
        name: "cat",
        cost: 2000000,
        info: "Its a cat! mrrrowww!",
        amount: 1,
        instock: true,
        func: async (message,bot,helper) => {
            var user = helper.getUser(message.author);
            switch (parseInt(helper.weightedRand({1:0.4,2:0.2}))) {
                case 1:
                    message.reply(`'s cat${(user.inv["cat"]>1)?'s':''} meow (+${user.inv["cat"]} meow${(user.inv["cat"]>1)?'s':''})`);
                    helper.addItem(message.author,"meow",user.inv["cat"]);
                    break;
                case 2:
                    message.reply(`'s cat${(user.inv["cat"]>1)?'s':''} breed asexually! (+${user.inv["cat"]} cat${(user.inv["cat"]>1)?'s':''})`)
                    helper.addItem(message.author,"cat",user.inv["cat"]);
                default:
                    // code
            }
        }
    },
    "doll": {
        name: "doll",
        cost: 15000,
        info: "A voodoo doll of yourself, do whatever you want to it.",
        amount: 1,
        instock: true,
        func: async (message,bot,helper) => {
            message.reply("`s doll starts flying and they break their arms against the ceiling. the medical bill is $200 (-200 cash)");
            helper.takeCash(message.author,200);
            return
        }
    },
    "derp": {
        name: "derp",
        cost: 50000,
        info: "One derp, to derp things.",
        amount: 1,
        instock: true,
        func: async (message,bot,helper) =>{
            switch (parseInt(helper.weightedRand({1:0.5,2:0.2,3:0.1,4:0.01}))) {
                case 1:
                    
            }
        }
    },
    "water": {
        name: "water",
        cost: 100000,
        info: "Holy Water, you should feel very blessed now.",
        amount: 1,
        instock: false
    },
    "vroom": {
        name: "vroom",
        cost: 500000,
        info: "Vroom vroom.",
        amount: 1,
        instock: true
    },
    "meow": {
        name: "moo",
        cost: 1000000,
        info: "A very rare meow, hard to find.",
        amount: 1,
        instock: false
    },
    "skiletro\'s-skull": {
        name: "skiletro\'s-skull",
        cost: 1000000,
        info: "Skiletro's skull! It glows, too.",
        amount: 1,
        instock: false
    },
    "potato": {
        name: "potato",
        cost: 2000000,
        info: "Just a potato.",
        amount: 1,
        instock: true,
        func: async (message,bot,helper) => {
            message.reply("I'm a potato.");
        }
    },
    "gold": {
        name: "gold",
        cost: 5000000,
        info: "Sparkly.",
        amount: 1,
        instock: false
    },
    "diamond": {
        name: "diamond",
        cost: 10000000,
        info: "You are rich.",
        amount: 1,
        instock: false
    },
    "house": {
        name: "house",
        cost: 50000000,
        info: "A decent size mansion.",
        amount: 1,
        instock: false
    },
    "cube": {
        name: "cube",
        cost: 76000000,
        info: "A Rubik's cube made of ice.",
        amount: 1,
        instock: true
    },
    "cracker": {
        name: "cracker",
        cost: 100000000,
        info: "Just in-case anyone ever rolls this high.",
        amount: 1,
        instock: false
    },
    "estate": {
        name: "estate",
        cost: 300000000,
        info: "You can live here forever.",
        amount: 1,
        instock: true
    },
    "billion": {
        name: "billion",
        cost: 999999999,
        info: "A bill not actually worth a billion.",
        amount: 1,
        instock: true
    },
    "company": {
        name: "company",
        cost: 25000000000,
        info: "A successful company that makes money.",
        amount: 1,
        instock: true
    },
    "antiPad": {
        name: "antiPad",
        cost: 100000000000,
        info: ".daPi wen A, For the rich, made from antimatter.",
        amount: 1,
        instock: true
    },
    "country": {
        name: "country",
        cost: 1000000000000,
        info: "You own a country and everything in it.",
        amount: 1,
        instock: true
    },
    "world": {
        name: "world",
        cost: 1000000000000000,
        info: "You managed to buy the entire world",
        amount: 1,
        instock: true
    },
    "god": {
        name: "god",
        cost: 90071992547409911000, // Max Safe Int * 1000
        info: "Even God sold himself to obey your will.",
        amount: 1,
        instock: true

    },
    "moonythedwarf": {
        name: "moonythedwarf",
        cost: 999999999999999999999,
        info: "How. I shall have my revenge! ):<",
        amount: 1,
        instock: true
    },
    "iczero": {
        name: "iczero",
        cost: 9999999999999999999,
        info: "I simply copied moonythedwarf. Nothing to see here... also REVENGE!!!!!",
        amount: 1,
        instock: true
    },
    "universe": {
        name: "universe",
        cost: Infinity,
        info: "You probably shouldn't have this..... YOU DIRTY CHEATER!!!!!!!! Or maybe you maxed out the Number value. who knows.", // practically impossible, it maxes out above 1e+100 which by itself is practically impossible to reach
        amount: 1,
        instock: true
    }
}