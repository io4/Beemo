module.exports = {
    main: async (bot, message, ...args) => {
    	var redisKeyJoin = `server:${message.guild.id}:autorole:join`;
      var redisKeyGet = `server:${message.guild.id}:autorole:get`;
      var subCommand = message.split(" ")[0];
      switch(subCommand){
        case "add":
          if(message.split(" ")[1] == "join"){
            await client.redis.saddAsync(redisKeyJoin, message.split(" ").slice(2).join(" "));
          } else if(message.split(" ")[1] == "get"){
            await client.redis.saddAsync(redisKeyGet, message.split(" ").slice(2).join(" "));
          }
          break;
      }
    },
    onGuildMemberAdd: async (client, member) => {
        var redisKeyJoin = `server:${message.guild.id}:autorole:join`;
        var joinRoles = await client.redis.smembers(redisKey);
        for(var i in joinRoles){
          for(var x in member.guild.roles){
            if(member.guild.roles[x].name==joinRoles[i].name){
              member.addRole(member.guild.roles[x]);
            }
          }
        }

    },
    help: 'Sets and gets autoroles.',
    guildOnly: true,
    args: '<add|remove|get> '
};
