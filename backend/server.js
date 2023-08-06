const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb://127.0.0.1:27017/mern-auth");

app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );
    res.status(200).json({ status: "Sucessfully Created User", token: token });
  } catch (err) {
    res.json({ error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      password: password,
      email: email,
    });
    if (user) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        "secret123"
      );
      res.status(200).json({ status: "Succefully Logged in", token: token });
    } else {
      res.json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500);
  }
});

app.listen(5000, () => {
  console.log("Server started at 5000");
});
