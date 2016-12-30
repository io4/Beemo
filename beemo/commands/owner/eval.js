module.exports = {
  main: async (bot, message, ...args) => {
    const client = bot;
    try {
      var res = eval(args.join(" "));
      if (typeof res !== 'string') res = require('util').inspect(res);
    } catch (err) {
      res = err.message;
    }
    message.channel.sendCode('js', res);
  },
  help: 'Eval stuff',
  hidden: true,
  ownerOnly: true,
  args: '<whatever to eval>'
};