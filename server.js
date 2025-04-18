const express = require('express');
const router = express.Router();
const { ServerConfig, CRON } = require('./config');
const PORT = ServerConfig.PORT;
const allRoutes = require('./routes');
const fileUpload = require('express-fileupload');
const { reqLogger } = require('./middleware');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(reqLogger);
app.use(fileUpload());

app.use('/v1', allRoutes);


app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
    CRON.scheduleCronsEveryMinute();
    CRON.scheduleCronsEveryTenMinutes();
})

