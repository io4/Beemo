'use strict';
function randInt(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}
function weightedRand(spec) {
  var i, j, table=[];
  for (i in spec) {
    // The constant 10 below should be computed based on the
    // weights in the spec for a correct and optimal table size.
    // E.g. the spec {0:0.999, 1:0.001} will break this impl.
    for (j=0; j<spec[i]*10; j++) {
      table.push(i);
    }
  }
  return function() {
    return table[Math.floor(Math.random() * table.length)];
  }
}
async function safeMakeData(member) {
    if (await member.redis.getAsync("capitalism_userData") == null || !await member.redis.getAsync("capitalism_userData")) {
        // Init the user.
        let user = {}
        user.inv= {};
        user.cash= 1000;
        user.cashAllTime= 1000;
        user.cashLostAT= 0;
        user.flags= {};
        await saveUser(member,user);
        return true;
    }
    return false;
}
async function randBuyValids(user) {
    var x = []
    Object.keys(items).forEach((element) => {
        var y = items[element];
        if (user.cashAllTime >= y.cost && y.cost > 0) {
            x.push(y);
        }
    })
    return x;
}
async function saveUser(member, user) {
    await member.redis.setAsync("capitalism_userData",JSON.stringify(user));
    return;
}
async function getUser(member) {
    await safeMakeData(member)
    var x = await member.redis.getAsync("capitalism_userData");
    return JSON.parse(x);
}
async function giveCash(member,cash,doAlltime=true) {
    await safeMakeData(member); // Doubles as a safety check, hence the 'safe' in its name.
    let user = await getUser(member);
    user.cash+=cash;
    if (doAlltime) {
        user.cashAllTime+=cash;
    }
    await saveUser(member, user);
    return;
}
async function takeCash(member,cash,doAlltime=true) {
    await safeMakeData(member); // Doubles as a safety check, hence the 'safe' in its name.
    let user = await getUser(member);
    user.cash-=cash;
    if (doAlltime) {
        user.cashLostAT+=cash;
    }
    await saveUser(member, user);
    return;
}
var itemExists=async (i)=>{let x;items[i]?x=true:x=false;return x};
async function addItem(member,itemName,amount=1) {
    await safeMakeData(member);
    if (await itemExists(itemName)) {
        let user = await getUser(member);
        if (user.inv[itemName]) {
            user.inv[itemName]+=amount;
        } else {
            user.inv[itemName]=amount
        }
        await saveUser(member,user);
        return false;
    }
    return true;
}
async function removeItem(member,itemName,amount=1) {
    await safeMakeData(member);
    if (itemExists(itemName)) {
        let user = await getUser(member);
        if (user.inv[itemName]) {
            if (amount > user.inv[itemName]) {
                return true; //failed
            }
            user.inv[itemName]-=amount;
            if (user.inv[itemName] <= 0) {
                user.inv[itemName] = undefined;
            }
            saveUser(member,user);
        } else {
            return true; //failed
        }
        return false; //success
    }
}
async function listItems(member,storeList=false) {
    safeMakeData(member);
    let user = await getUser(member);
    
    let str = "";
    if (storeList==true) {
        
        Object.keys(items).forEach((element)=>{
           if (user.cashAllTime >= items[element].cost && items[element].instock == true) {
               str+=`${items[element].name}(${items[element].cost}), `;
           } 
        });
        if (str=="") {
            return "Nothing is here...";
        }
        return str.slice(0,str.length-2)

    } else {
        Object.keys(user.inv).forEach((element)=>{
            str+=items[element].name+"("+user.inv[element]+"), ";
        });
        if (str=="") {
            return "Nothing is here...";
        }
        return str.slice(0,str.length-2)
    }
    return "Error";
    
}
let items = {
    "spacetime-tear": {
        name:"spacetime-tear",
        cost: -999999999999999999999,
        info: "God help you.",
        amount: 1,
        instock:false
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
        cost: 10,
        info: "Your very own Pocket Lemonade Stand 9001",
        amount: 1,
        instock: true,
        func: async (message,bot) => {
            var x = randInt(1,10);
            message.reply(`You sell some lemonade, earning ${x} dollars (+${x} cash)`);
            await giveCash(message.author, x);
            return;
        }
    },
    "chips": {
        name: "chips",
        cost: 50,
        info: "Baked Lays.",
        amount: 1,
        instock: true,
        func: async (message,bot) => {
            switch (parseInt(weightedRand({0:1,1:0.3})())) { // for some reason it returns a string.
                case 0:
                    message.reply(`eats a bag of chips ([${message.author.username}] -1 chips +1 junk)`);
                    await removeItem(message.author,'chips');
                    await addItem(message.author,'junk');
                    break;
                case 1:
                    let x = randInt(1,10);
                    message.reply(`gets inspired by the chips and bakes some more! ([${message.author.username}] +${x} chips)`)
                    await addItem(message.author,'chips',x);
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
        func: async (message,bot)=>{
            var user = await getUser(message.author);
            switch (parseInt(weightedRand({0:1,1:0.3})())) {
                case 0:
                    var valids = await randBuyValids(user);
                    var x = randInt(0,valids.length-1);
                    var cost = randInt(valids[x].cost-(valids[x].cost/2),valids[x].cost+(valids[x].cost/2));
                    if (cost > user.cash) {
                        message.reply(`You couldn't afford to buy ${valids[x].name}`);
                    } else {
                        await takeCash(message.author,cost);
                        await addItem(message.author,valids[x].name);
                        message.reply(`You bought a ${valids[x].name} for ${cost}`);
                    }
                    break;
                case 1:
                    message.reply(`'s ipad broke! ([${message.author.username}] -1 ipad)`);
                    await removeItem(message.author,'ipad');
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
        func: async (message,bot)=>{
            switch (parseInt(weightedRand({0:1,1:0.3,2:0.01})())) {
                case 0:
                    message.reply('You flip the table.  \`(╯°□°）╯︵ ┻━┻\`');
                    break;
                case 1: 
                    message.reply('You flip the table and it breaks!  \`(╯°□°）╯︵ ┻ ┻ \` (-1 table)');
                    await removeItem(message.author,'table');
                    break;
                case 2:
                    let rand = randInt(1000,2000);
                    message.reply(`Your table turns out to be a ancient relic, you sell it on Ebay for ${rand} (+${rand} cash)`);
                    await removeItem(message.author,'table');
                    await giveCash(message.author,rand);
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
        func: async (message,bot) => {
            switch (parseInt(weightedRand({0:1,1:0.01,2:0.1})())) {
                case 0: 
                    message.reply("You turn the lamp off and on again.");
                    break;
                case 1:
                    message.reply("'s lamp breaks into a billion pieces (-1 lamp, +1 billion)");
                    await removeItem(message.author,'lamp');
                    await addItem(message.author,'billion');
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
        func: async (message,bot) => {
            switch (parseInt(weightedRand({0:1,1:0.1,2:0.1})())) {
                case 0:
                    message.reply(" feeds his penguin");
                case 1:
                    message.reply(" has a penguin roast (-1 penguin)");
                    await removeItem(message.author, 'penguin');
                case 2:
                    var x = (await getUser(message.author)).inv['penguin'];
                    message.reply(`'s penguin(s) multiply! (+${x} penguins)`);
                    await addItem(message.author,'penguin',x)
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
    "doll": {
        name: "doll",
        cost: 15000,
        info: "A voodoo doll of yourself, do whatever you want to it.",
        amount: 1,
        instock: true,
        func: async (message,bot) => {
            message.reply("`s doll starts flying and they break their arms against the ceiling. the medical bill is $200 (-200 cash)");
            takeCash(message.author,200);
            return
        }
    },
    "derp": {
        name: "derp",
        cost: 50000,
        info: "One derp, to derp things.",
        amount: 1,
        instock: true
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
    "moo": {
        name: "moo",
        cost: 1000000,
        info: "A very rare moo, hard to find.",
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
        func: async (message,bot) => {
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
    "cow": {
        name: "cow",
        cost: 24000000,
        info: "Can generate moo's.",
        amount: 1,
        instock: true
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
    "moo2": {
        name: "moo2",
        cost: 500000000,
        info: "This moo has evolved into something new.",
        amount: 1,
        instock: false
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
        cost: 90071992547409911,
        info: "Even God sold himself to obey your will.",
        amount: 1,
        instock: true
    },
    "moonythedwarf": {
        name: "moonythedwarf",
        cost: 9999999999999999999,
        info: "How. I shall have my revenge! ):<",
        amount: 1,
        instock: true
    }
}
module.exports = {
    items: items,
    listItems: listItems,
    giveCash: giveCash,
    getUser: getUser,
    takeCash: takeCash,
    addItem: addItem,
    removeItem: removeItem,
    safeMakeData: safeMakeData,
    saveUser: saveUser,
    itemExists: itemExists,
    randInt: randInt
}