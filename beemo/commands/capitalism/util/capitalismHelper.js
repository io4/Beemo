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
async function saveUser(member, user) {
    await member.redis.setAsync("capitalism_userData",JSON.stringify(user));
    return;
}
async function makeSkeleton() {
    let user = {}
    user.inv= {};
    user.cash= 1000;
    user.cashAllTime= 1000;
    user.cashLostAT= 0;
    user.flags= {};
    return user;
}
async function safeMakeData(member) {
    if (await member.redis.getAsync("capitalism_userData") == null || !await member.redis.getAsync("capitalism_userData")) {
        // Init the user.
        await saveUser(member,makeSkeleton());
        return true;
    }
    return false;
}
async function resetUser(member) {
    await saveUser(member,makeSkeleton());
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

delete require.cache[require.resolve('./items.js')];
var items = require('./items.js');

module.exports = {
    items: items,
    listItems: listItems,
    giveCash: giveCash,
    getUser: getUser,
    takeCash: takeCash,
    addItem: addItem,
    removeItem: removeItem,
    safeMakeData: safeMakeData,
    resetUser: resetUser,
    saveUser: saveUser,
    itemExists: itemExists,
    weightedRand: weightedRand,
    randBuyValids: randBuyValids,
    randInt: randInt
}