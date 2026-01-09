require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));


app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false
  })
);


app.use("/", require("./routes/homeRoutes"));
app.use("/", require("./controller/loginAuthLogic"));
app.use("/", require("./controller/signAuthLogic"));
app.use("/host", require("./routes/hostRoutes"));
app.use("/host", require("./controller/addHomeLogic"));
app.use("/", require("./routes/favouriteRoutes"));
app.use("/", require("./routes/bookingRoutes"));

app.use("/rented", require('./routes/renterRoutes'));



app.use('/payments', require('./routes/paymentRoutes'));

app.get('/booking', (req, res) => {
  res.render('booking');
});

app.use('/receipt',require('./routes/bookingManageRoutes'));


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
