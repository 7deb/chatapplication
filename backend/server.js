require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const databaseConnect = require("./lib/db");
const authrouter = require('./routes/userRoutes');
const messagerouter = require('./routes/messageRoutes');

const Port = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use('/api/user', authrouter);
app.use('/api/message', messagerouter);
databaseConnect();
app.listen(Port,()=>{
    console.log(`server is running on http://localhost:${Port}`);
})