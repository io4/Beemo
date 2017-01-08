module.exports = (client, event) => {
	return function runEvt(...args) {
		try {
			return event(client, ...args);
		} catch (err) {
			client.error(`Error running event ${event}: ${err}`);
		}
	}
}