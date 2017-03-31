'use strict';

// Корневой каталог
global.__rootdir = __dirname;

const config = require('./config.json'),
	express = require('express'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	morgan = require('morgan'),
	db = require('./models'),
	routes = require('./routes'),
	Sequelize = require('sequelize'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session);

// Sequelize использует bluebirdовские обещания,
// поэтому мы тоже будем использовать их для совместимости
global.Promise = Sequelize.Promise;

const sessionConfig = {
	secret: config.auth.secret,
	cookie: {
		maxAge: config.auth.cookieAge
	},
	store: new RedisStore(config.redis)
};

const app = express();

// Обработчики
app.use(morgan('dev', { immediate: true }));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));			// application/x-www-form-urlencoded
app.use(bodyParser.json());										// application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));	// application/vnd.api+json as json
app.use(session(sessionConfig));
app.use(methodOverride());

// Маршруты
routes(app);

// Ловим 404 и пробрасываем в следующий обработчик
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
});

db.sync()
	.then(() => {
		app.listen(config.server.port, config.server.host, function () {
			console.log('Server listening on %s:%d', config.server.host, config.server.port);
		})
	})
	.catch(e => {
		console.log('Database syncing error: ' + e);
	});