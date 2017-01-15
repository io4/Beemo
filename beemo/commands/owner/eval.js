const rp = require("request-promise");

module.exports = {
  main: async (bot, message, ...args) => {
    const client = bot;
    const cm = client.commandManager;
    const pm = client.prefixManager;
    const lm = client.listenerManager;
    const rm = client.redisManager;

    try {
      var res = eval(args.join(" "));
      if (typeof res !== 'string') res = require('util').inspect(res);
    } catch (err) {
      res = err.message;
    }

    if(res.length > 2000) {
      var options = {
        method: 'POST',
        uri: 'https://pybin.pw/documents',
        body: res,
        json: true
      };

      response = await rp(options);
      res = `https://pybin.pw/${response.key}`;
      message.channel.sendMessage(res);
    } else {
      message.channel.sendCode('js', res);
    }
  },
  help: 'Eval stuff',
  hidden: true,
  ownerOnly: true,
  args: '<whatever to eval>'
};