const cloudinary = require("cloudinary").v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

module.exports = cloudinary;
