const mongoose = require('mongoose');

const dbConnection = process.env.DB_CONNECTION || "mongodb+srv://Amiros:Amirbena1204@cluster0.tkccy.mongodb.net/bankMission?retryWrites=true";

mongoose.connect(dbConnection, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
    .then(() => console.log("DB CONNECTED"))
    .catch(ex => console.log("DB FAILED TO CONNECT, Reason: ", ex.message));

