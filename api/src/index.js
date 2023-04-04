require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const v1AppRouter = require('./v1/routes/appRoutes');

const PORT = process.env.PORT || 3001;
const mongoString = process.env.DATABASE_URL;

const app = express();

async function start() {
	mongoose.connect(mongoString);
	try {
		await mongoose.connect(mongoString);
		console.log('Connected to DB')
		app.use(cors())
		app.use(express.json());
		app.use('/api/v1', v1AppRouter);

		app.listen(PORT, () => {
			console.log(`API is listening on port ${PORT}`);
		});
	} catch (error) {
		console.error(err);
	}
}

start();