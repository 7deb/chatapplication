require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");

const databaseConnect = require("./backend/lib/db");
const authrouter = require("./backend/routes/userRoutes");
const messagerouter = require("./backend/routes/messageRoutes");
const { initSocket } = require("./backend/socket/socket");

const app = express();
const server = http.createServer(app); // Shared HTTP server

const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // For development
    credentials: true,
  })
);

app.use("/api/user", authrouter);
app.use("/api/message", messagerouter);

databaseConnect();
initSocket(server);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
