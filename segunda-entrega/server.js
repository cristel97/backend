const express = require("express");
const { connect } = require("mongoose");
const routerProducts = require('./src/routes/routerProducts.js');
const routerCarts = require('./src/routes/routerCarts.js');
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;