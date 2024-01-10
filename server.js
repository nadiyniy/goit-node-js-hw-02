const app = require('./app');
const mongoose = require('mongoose');
const { envsConfig } = require('./configs');

mongoose
	.connect(envsConfig.dbHost)
	.then(() => {
		app.listen(envsConfig.port, () => {
			console.log('Database connection successful');
		});
	})
	.catch(() => {
		console.log('error connecting to Mongo');
		process.exit(1);
	});
