
//Importing and creating instances of the packages , and defining the port number.
const express = require('express');
const app = express();
const port = 3000;



// Define a GET endpoint at '/ping' that responds with 'pong'
app.get('/ping', (req, res) => {
    res.send('pong');
});


// Start the server and listen on the defined port

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});