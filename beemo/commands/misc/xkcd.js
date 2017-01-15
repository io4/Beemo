const xkcd = require('xkcd');

module.exports = {
    main: async (bot, message, ...args) => {
    	function sendComic(comic) {
    	var embed = new Discord.RichEmbed();
	    embed.setTitle(`XKCD #${comic.num} - ${comic.title}`);
	    embed.setColor('#2ecc71');
		embed.setDescription(comic.alt);
		embed.setImage(comic.img);
	    	message.channel.sendEmbed(embed);
    	}
        const xkcdNumber = bot.resolve.num(message.content);
        if(!xkcdNumber) {
        	var comic = xkcd(sendComic);
        } else {
        	var comic = xkcd(xkcdNumber, sendComic);
        }
    },
    help: 'Gets something from xkcd',
    args: '[xkcd comic id]'
};
