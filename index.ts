// require("dotenv").config();

// const { App } = require("@slack/bolt");
// import { App } from "npm:@slack/bolt";
import { App } from "@slack/bolt";

// import "jsr:@std/dotenv/load";
import "@std/dotenv/load";
// import { ClientRequest } from "node:http";

// import PROMPT from "pr
type TriggerType = "ping"; // gorkie

interface Trigger {
  type: TriggerType;
  info: string | string[];
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/hendra", async ({ command, ack, respond }) => {
  await ack();
  await respond({ text: `yes what whar huh what?` });
});

app.command("/hendra-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `ugh fine. Pong!\nLatency: ${latency}ms` });
});

app.command("/weather-ports", async ({ command, ack, respond }) => {
  await ack();
  await respond({
    text: "",
  });
});

app.command("/hendra-help", async ({ command, ack, respond }) => {
  await ack();
  await respond({
    text: `Commands:
        /hendra-ping - speed
        /hendra - huh
        /hendra-help`,
  });
});

app.event("member_joined_channel", async ({ event, say, client, logger }) => {
  try {
    await client.chat.postMessage({
      channel: event.channel,
      text:
        `<@${event.user}> :wavey: Welcome to Henry's channel! <@${`U080F22CTJN`}>, greet your guest. Behave, or I might have to █████ ███ ██████ :>.`,
    });
  } catch (error) {
    logger.error("Error handling event:", error);
    console.log(error);
  }
});

app.event("member_left_channel", async ({ event, say, client, logger }) => {
  try {
    await client.chat.postMessage({
      channel: event.channel,
      text: `bye...`,
    });
  } catch (error) {
    logger.error("Error handling event:", error);
    console.log("Error handling event:", error);
  }
});

// app.event("app_mention", async ({ event, say, client, logger}) => {})

(async () => {
  await app.start();
  console.log("Hendra is awake!");
})();
