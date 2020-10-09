module.exports = (() => {
	const dbConnection = require('./routes/dbConnection.js');
	const reactHome = require('./routes/reactHome.js');

	return {
		dbConnection: dbConnection,
		reactHome: reactHome
	}
})();
