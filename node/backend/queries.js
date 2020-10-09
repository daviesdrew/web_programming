module.exports = (() => {
	const create = require('./queries/create.js');
	const read = require('./queries/read.js');
	const update = require('./queries/update.js');
	const remove = require('./queries/remove.js');

	return {
		create: create,
		read: read,
		update: update,
		remove: remove
	}
})();
