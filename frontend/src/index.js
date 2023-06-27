import React from "react";
import ReactDOM from "react-dom";
//import { Route } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import "./Login.css";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://eddiemenello:Dandy007@cluster0.44fnfxx.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB:', err));
