const assert = require('assert');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const mongo = require('mongodb').MongoClient;
const path = require('path');

const routesPath = path.join(__dirname, 'routes.js');

const routes = require(routesPath);
const dbConnection = routes.dbConnection(express, assert, mongo);
const reactHome = routes.reactHome(express, path);

const queriesPath = path.join(__dirname, 'queries.js');
const queries = require(queriesPath); 

const app = express();
app.set('port', process.env.PORT || 8080);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(logger('short'));
app.use(helmet());

app.use('/', reactHome);
app.use('/db', dbConnection); 

app.use((req, res, next) => {
	res.status(404).send('Page Not Found');
	res.end();
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send('Internal Errror');
	res.end();
});

app.listen(app.get('port'), () => {
	console.log('server running on http://localhost'
			.concat(app.get('port'), '\n\n'))
});
