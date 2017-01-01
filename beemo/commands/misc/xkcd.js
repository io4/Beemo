const xkcd = require('xkcd');
const resolveNum = require("../../util/resolveNum.js");

module.exports = {
    main: async (bot, message, ...args) => {
    	function sendComic(comic) {
    		message.reply(`XKCD ${comic.num}: **${comic.title}**\n\n${comic.img}`);
    	}
        const xkcdNumber = resolveNum(message.content);
        if(!xkcdNumber) {
        	var comic = xkcd(sendComic);
        } else {
        	var comic = xkcd(xkcdNumber, sendComic);
        }
    },
    help: 'Gets something from xkcd',
    args: '[xkcd comic id]'
};
