require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

const databaseConnect = require("./backend/lib/db");
const authrouter = require("./backend/routes/userRoutes");
const messagerouter = require("./backend/routes/messageRoutes");
const { initSocket } = require("./backend/socket/socket");

const app = express();
const server = http.createServer(app); // Shared HTTP server

//  Middlewares on the shared app
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Routes
app.use("/api/user", authrouter);
app.use("/api/message", messagerouter);

// DB and Sockets
databaseConnect();
initSocket(server); // Pass shared server here

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
