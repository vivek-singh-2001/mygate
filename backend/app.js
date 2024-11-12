const express = require("express");
const morgan = require("morgan");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./utils/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");

// import routes here
const user_route = require("./features/users/userApis");
const society_route = require("./features/society/societyApis");
const wing_route = require("./features/wing/wingApis");
const house_route = require("./features/house/houseApi");
const houseuser_route = require("./features/houseuser/houseuserApis");
const auth_route = require("./features/authentication/authApi");
const sms_route = require("./features/sms/smsApis");
const event_route = require("./features/events/eventApi");
const chat_route = require("./features/chat/chatApi");
const visitor_route = require("./features/visitors/visitorApis");
const notice_route = require("./features/notice/noticeApis");
const notification_route = require("./features/notificationCount/notificationCountApis");
const payment_route = require("./features/payment/paymentApis")

const staff_Routes = require("./features/staff/staffApis");
// USE MODULES HERE
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const allowedOrigins = ["http://localhost:4200", "http://192.1.200.38:4200"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Serve static files from the 'dist' directory
app.use(
  "/static",
  express.static(path.join(__dirname, "dist"), {
    maxAge: "1y",
    setHeaders: function (res, path) {
      if (path.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else {
        res.setHeader("Cache-Control", "public, max-age=31536000");
      }
    },
  })
);
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// USE ROUTES HERE
app.use("/api/v1/users", user_route);
app.use("/api/v1/society", society_route);
app.use("/api/v1/wing", wing_route);
app.use("/api/v1/house", house_route);
app.use("/api/v1/houseuser", houseuser_route);
app.use("/api/v1/auth", auth_route);
app.use("/api/v1/sms", sms_route);
app.use("/api/v1/events", event_route);
app.use("/api/v1/chats", chat_route);
app.use("/api/v1/visitors", visitor_route);
app.use("/api/v1/staff", staff_Routes);
app.use("/api/v1/notice", notice_route);
app.use("/api/v1/notificationcount", notification_route);
app.use("/api/v1/payments", payment_route);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("*", (req, res, next) => {
  const err = new CustomError(
    `can't find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

// Route all other requests to Angular
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/frontend/browser/index.html"));
});

// ERROR HANDLER MUST BE DEFINED LAST
app.use(globalErrorHandler);
module.exports = app;
