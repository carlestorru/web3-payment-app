// Load environment variables
require('dotenv').config();

// Load required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Load the routes for the API
const v1AppRouter = require('./v1/routes/appRoutes');

// Define the port for the API and the MongoDB connection string
const PORT = process.env.PORT || 3001;
const mongoString = process.env.DATABASE_URL;

// Create the express application
const app = express();

// Define an asynchronous function to start the server
async function start() {
	// Connect to MongoDB
	mongoose.connect(mongoString);
	try {
		await mongoose.connect(mongoString);
		console.log('Connected to DB');

		// Set up CORS and JSON parsing middleware
		app.use(cors());
		app.use(express.json());

		// Mount the v1AppRouter on the /api/v1 route
		app.use('/api/v1', v1AppRouter);

		// Start the server and listen on the specified port
		app.listen(PORT, () => {
			console.log(`API is listening on port ${PORT}`);
		});
	} catch (error) {
		console.error(err);
	}
}

// Call the start function to start the server
start();
