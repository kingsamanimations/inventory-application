require("dotenv").config();
const path = require("node:path");
const express = require("express");
const categoryRouter = require("./routes/categoryRouter");
const itemRouter = require("./routes/itemRouter");

const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true }));

// Static file server to get css stylesheets to work
app.use(express.static(path.join(__dirname, "public")));


//Swapping the redirect for a render
app.get("/", (req, res) => {
    res.render("index");
});

app.use("/categories", categoryRouter);
app.use("/items", itemRouter);

// Local host listener
app.listen(PORT, () => console.log(`listening on ${PORT}`));

// Proper error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Server error");
});