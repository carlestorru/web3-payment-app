const express = require('express');

const v1AppRouter = require('./v1/routes/appRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/v1', v1AppRouter);

app.listen(PORT, () => {
	console.log(`API is listening on port ${PORT}`);
});
