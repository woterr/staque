const express = require("express");
const app = express();

const rootRoutes = require(`./routes/root-routes`);
const authRoutes = require(`./routes/auth-routes`);
const middleware = require("./middleware");
const dashRoutes = require("./routes/dash-routes");
const cookies = require("cookies");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const port = process.env.PORT || 3000;

__dirname;
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookies.express("a", "b", "c"));

app.use(express.static(`${__dirname}/assets`));
app.locals.basedir = `${__dirname}/assets`;

app.use(
  "/",
  middleware.updateUser,
  rootRoutes,
  authRoutes,
  middleware.validateUser,
  middleware.updateGuilds,
  dashRoutes
);

app.use("/dashboard", middleware.validateUser, dashRoutes);

app.all("*", (req, res) => res.render("404"));

app.listen(port, () => console.log(`Server is live on port 3000`));
