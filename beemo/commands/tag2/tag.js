/* global tagProcessSafe processTag */ // cloud9 hates ASYNC
const Discord = require("discord.js");
function randInt(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}
async function tagProcessSafe(message,tagname,args) {
    console.log(tagname);
    var x = await message.guild.redis.getAsync(`tag_${tagname}`);
    console.log(x);
    if (x) {
        return await processTag(x,message,args);
    } 
    return "That tag does not exist!";
};
async function processTag(tagdata,message,args) {
    console.log(args.length);
    let dargs = [0,0,0,0,0];
    if (args.length > 0) {
        dargs = args;
    }
    console.log(dargs);
    let str = tagdata; // being safe.
    str = str.replace("{rand6}", randInt(1, 6));
    str = str.replace("{rand20}", randInt(1, 20));
    str = str.replace('{user}',message.author.username);
    str = str.replace('{mention}', message.author.mention);
    str = str.replace('{userid}', message.author.id);
    dargs.forEach((element,index)=>{
        str = str.replace(`{a${index+1}}`,element);
    });
    let data = str.split("{dc}");
    str = data.shift();
    data = data.join().split("{ds}");
    console.log(data);
    dargs.forEach((element, index) => {
        console.log("ping");
        data.forEach((element2, index2) => {
            console.log("bing.");
            var i = element
            if (element == 0) {
                i = element2;
            }
            console.log("{a" + (index + 1) + "||d" + (index2 + 1) + "}");
            str = str.replace("{a" + (index + 1) + "||d" + (index2 + 1) + "}", i);
        })
    })
    dargs.forEach((element, index) => {
        data.forEach((element2, index2) => {
            var i = randInt(parseInt(element), parseInt(element2));
            console.log("{randd" + (index + 1) + "d" + (index2 + 1) + "}");
            str = str.replace("{randd" + (index + 1) + "d" + (index2 + 1) + "}", i);
        })
    })
    if (str.indexOf("{embed}") != -1) {
        str = str.replace("{embed}","");
        const embed = new Discord.RichEmbed();
        data.forEach((element,index)=>{
            if (str.indexOf(`{emcolord${index+1}}`) != -1) {
                if (/^#[0-9A-F]{6}$/i.test(element)) {
                    str = str.replace(`{emcolord${index+1}}`,'');
                    embed.setColor(element); // Yay!
                } else {
                    str = str.replace(`{emcolord${index+1}}`,'Invalid Color Code ({emcolordn})');
                }
                
            }
        });
        str.split("{emsec}").forEach((element,index)=>{
            embed.addField(`Section ${index+1}`,element);
        });
        
        message.channel.sendEmbed(embed);
        return "Embedded";
    }
    return str;
};
module.exports = {
    main: async (bot,message, ...args) => {
        switch (args[0].toLowerCase()) {
            case 'raw':
                var x = await message.guild.redis.getAsync(`tag_${args[1]}`);
                console.log(x);
                if (x) {
                    return x;   
                }
                break;
            case 'make':
                args.shift()
                var name = args.shift()
                var str = args.join(" ");
                await message.guild.redis.setAsync(`tag_${name}`, str);
                message.reply(`Tag created: with the name ${name} and the contents: ${str}`);
                break;
            default:
                if (args[0] == "") {
                    message.reply("How 2 Use: use the 'raw <tag>' command to view a unprocessed tag, and use 'make <tagname> <contents> to make your own! Beemo docs should contain info on how tags work!")
                }
                message.reply(await tagProcessSafe(message,args.shift(),args));
        }
    }
};