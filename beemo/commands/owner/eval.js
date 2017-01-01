const rp = require("request-promise");

module.exports = {
  main: async (bot, message, ...args) => {
    const client = bot;
    try {
      var res = eval(args.join(" "));
      if (typeof res !== 'string') res = require('util').inspect(res);
    } catch (err) {
      res = err.message;
    }

    if(res.size > 2000) {
      var options = {
        method: 'POST',
        uri: 'https://pybin.pw/documents',
        body: res,
        json: true
      };

      response = await rp(options);
      response = response.key;
    }
    message.channel.sendCode('js', res);
  },
  help: 'Eval stuff',
  hidden: true,
  ownerOnly: true,
  args: '<whatever to eval>'
};