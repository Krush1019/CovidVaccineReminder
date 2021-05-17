const TelegramBot = require("node-telegram-bot-api");
const http = require("http");
const request = require("request");
require("dotenv").config();

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: false });

var pincode = "384315";
var intval = 60000;

var loopfun = function () {
  var dt = new Date();
  var dt1 = `${dt.getDate()}-${dt.getMonth() + 1}-${dt.getFullYear()}`;
  request(
    {
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${dt1}`,
      method: "GET",
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10,
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        if (body.centers.length) {
          var text =
            "hello everyone, new vaccine schedule available here is the details :\n\n";
          body.centers.forEach((center) => {
            var temp = true;
            center.sessions.forEach((session) => {
              if (
                session.available_capacity_dose1 ||
                session.available_capacity_dose2
              ) {
                if (temp) {
                  text += `center name :${center.name}\nAddress :${center.address}\n`;
                  temp = false;
                }
                text += `\ndate :${session.date}\ndose 1 :${session.available_capacity_dose1}\ndose 2 :${session.available_capacity_dose2}\nmin age :${session.min_age_limit} \n------------------`;
              }
            });
            if (!temp) {
              text += "\n==================\n";
            }
          });
          const chatId = process.env.CHATID;
          bot.sendMessage(chatId, text);
          intval = 3600000;
          clearInterval(requestLoop);
          requestLoop = setInterval(loopfun, intval);
        } else {
          if (intval == 3600000) {
            clearInterval(requestLoop);
            intval = 60000;
            requestLoop = setInterval(loopfun, intval);
          }
        }
      } else {
        console.log("error" + response.statusCode);
      }
    }
  );
};
var requestLoop = setInterval(loopfun, intval);
