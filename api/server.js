require('dotenv').config();
const express = require('express');
const app = express();
const registerRoute = require('./routes/register');

app.use(express.json());
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Welcome to the API');
} );

app.use('/api/register', registerRoute);

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
