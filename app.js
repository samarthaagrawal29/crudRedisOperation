require('dotenv').config()
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./config/logger');
const routes = require('./routes');
const { connectMongoose } = require('./databases');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

//DataBase Connection
connectMongoose();


// Define rate limiting options
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

//Main page API
app.get("/", async (req, res, next) => {
    res.send("Hello From Main Page!!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.message);
    console.log(err.message);
    res.status(500).send('Internal Server Error');
});

app.use("/api", routes);
app.use(limiter);

app.listen(process.env.PORT, () => {
    logger.info("Server Working on PORT");
    console.log("Server Working on PORT");
})