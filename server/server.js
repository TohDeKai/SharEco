require("dotenv").config();
const express = require("express")

const app = express()

// Choosing port for Express to listen on

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is up and listening on Port ${port}`);
})