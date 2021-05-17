const TelegramBot = require("node-telegram-bot-api");
const http = require("http");
const request = require("request");

const token = "";

const bot = new TelegramBot(token, { polling: false });

// bot.on("message", (msg) => {
//   console.log(msg);
//type other code here

var dt = new Date();
var dt1 = `${dt.getDate()}-${dt.getMonth() + 1}-${dt.getFullYear()}`;

var requestLoop = setInterval(function () {
  request(
    {
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=384330&date=24-05-2021`,
      method: "GET",
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10,
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        // console.log(body);
        if (body.centers) {
          var text =
            "hello everyone, new vaccine schedule available here is the details :\n\n";
          body.centers.forEach((center) => {
            let cntr = center.name;
            text += `center name :${cntr}\nAddress :${center.address}\n`;

            center.sessions.forEach((session) => {
              text += `\ndate :${session.date}\ndose 1 :${session.available_capacity_dose1}\ndose 2 :${session.available_capacity_dose2}\nmin age :${session.min_age_limit} \n------------------`;
            });
            // if (center.sessions[0].available_capacity_dose1) {
            //   console.log(center.name);
            // }
            text += "\n=====================================\n";
          });
          console.log(text);
          // console.log("sucess!");
          // console.log(body.sessions[0].available_capacity_dose1);
          // const chatId = "@vaccineReminder";
          // var text =
          // "Available dose :" + body.sessions[0].available_capacity_dose1;
          // bot.sendMessage(chatId, text);
        } else {
          console.log("error!");
        }
        // console.log(response);
      } else {
        console.log("error" + response.statusCode);
      }
    }
  );
}, 10000);

// const chatId = "@vaccineReminder";
// var text = 1;
// setInterval(() => {
//   bot.sendMessage(chatId, "Received your message: " + text);
//   console.log(text);
//   text++;
// }, 1000);
