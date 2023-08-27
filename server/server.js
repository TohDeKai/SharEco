const express = require("express")

const app = express()

// Choosing port for Express to listen on

port = 3000
app.listen(port, () => {
    console.log(`Server is up and listening on Port ${port}`);
})