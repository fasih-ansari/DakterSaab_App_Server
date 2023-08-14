const mongoose = require('mongoose');

require('dotenv').config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => 
        console.log('no connection',err)
    );