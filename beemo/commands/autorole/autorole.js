module.exports = {
    main: async (bot, message, ...args) => {
    	var redisKeyJoin = `server:${message.guild.id}:autorole:join`;
      var redisKeyGet = `server:${message.guild.id}:autorole:get`;
      var subCommand = args[0];
      switch(subCommand){
        case "add":
          if(args[1] == "join"){
            await client.redis.saddAsync(redisKeyJoin, args.slice(2).join(" "));
            message.reply(":ok_hand:");
          } else if(args[1] == "get"){
            await client.redis.saddAsync(redisKeyGet, args.slice(2).join(" "));
            message.reply(":ok_hand:");
          }
          break;
          case "get": 
            var getRoles = await client.redis.smembers(redisKeyGet);
            if(getRoles.indexOf(args.slice(1).join(" "))>-1){
                    member.addRole(message.guild.roles.find("name",args.slice(1).join(" ")));
               } else {
                    message.reply("That role is not in the autorole list");
               }
          break;
      }
    },
    onGuildMemberAdd: async (client, member) => {
        var redisKeyJoin = `server:${message.guild.id}:autorole:join`;
        var joinRoles = await client.redis.smembers(redisKeyJoin);
        for(var i in joinRoles){
              member.addRole(member.guild.roles.find("name",joinRoles[i]));
        }

    },
    help: 'Sets and gets autoroles.',
    guildOnly: true,
    args: '<add|remove|get> '
};
