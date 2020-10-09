module.exports = ((express, assert, mongo) => {

	const dbInfo = {
			'connectionString': 'mongodb://localhost:27107',
			'dbName': 'library',
			'mongoUri': '3',
	}
	
	const routes = express.Router();

	let connectionPool;
	mongo.connect(
		dbInfo.connectionString,
		{ useUnifiedTopology: true },
		(err, db) => {
			assert.equal(err, null);
			connectionPool = db;
			console.log('oltp connection pool created');
		}
	);
	

	
	let prepDataSourceRoutes = (routes, mongo) => {
		
	
		routes.get('/queryKeyA', (req, res) => {
			search(dbInfo.dbName,
			       req.collection, 
			       queries.queryKeyA(),
			       res, 
			       '/queryKeyA');
		});
		
		routes.get('/queryKeyB', (req, res) => {
			search(dbInfo.dbName,
			       req.collection, 
			       queries.queryKeyB(),
			       res, 
			       '/queryKeyB');
		});
		
		return routes;
	}
	
	const search = async(db, coll, query, res, path) => {
			connectionPool.db(db)
				      .collection(coll)
				      .aggregate(query)
				      .then((results) => {
					      res.json(results);
				      }).catch((err) => {
					      assert.equal(err, null);
					      console.log(path);
				      });
		}

	return prepDataSourceRoutes(routes, mongo);
});
