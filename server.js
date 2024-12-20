import express from 'express';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Load all routes
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
