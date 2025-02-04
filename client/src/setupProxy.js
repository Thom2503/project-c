const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
dotenv.config();

const target = process.env.PHP_API_HOST
  ? `http://${process.env.PHP_API_HOST}:${process.env.PHP_API_PORT}`
  : "http://localhost:80";

console.log("Target URL:", target);


const context = [
    "/accounts", "/supplies", "/agendaitems", "/useritems", "/rooms", "/notifications",
    "/mailnotification", "/news", "/usersupplies", "/NieuwsDetails", "/events", "/eventdelete",
    "/eventsusers", "/eventvoters", "/eventjoin", "/eventleave", "/eventvote", "/eventresetvote",
    "/eventcomments", "/updateevent", "/news", "/usersupplies", "/NieuwsDetails", "/events",
    "/usernotifications", "/room", "/accountevents", "/keys"
];


const onError = (err, req, resp, target) => {
  console.error(`${err.message}`);
};

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    onError: onError,
    secure: false,
    headers: {
      Connection: "Keep-Alive",
    },
  });

  app.use(appProxy);
};
