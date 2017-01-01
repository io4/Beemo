module.exports = {
    main: async (bot, message, ...args) => {
      require('request')("http://random.cat/meow", (error, response, body) => {
        if(error) {
          return "Dang, I couldn't get a cat."
        } else {
          var image = JSON.parse(body);
           return 'A cat!!!! '+image.file
        }
      })
    },
    help: 'Shows a cute cat!'
};
