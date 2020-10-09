module.exports = (express, path) => {
	const route = express.Router();
	reactIndex = path.join(__dirname, '..', '..', '..', 'node', 
			       'frontend', 'build', 'index.html');

	route.get('/*', (req, res) => {
		res.sendFile(reactIndex);
	});

	return route;
}
