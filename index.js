// require("dotenv").config();

// const { App } = require("@slack/bolt");
import { App } from "npm:@slack/bolt";

import "jsr:@std/dotenv/load";

// import PROMPT from "prompt.md";

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/hendra", async({ command, ack, respond }) => {
    await ack();
    await respond({ text: `yes what whar huh what?` })
});

app.command("/hendra-ping", async({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ text: `ugh fine. Pong!\nLatency: ${latency}ms` })
});

app.command("/hendra-help", async({ command, ack, respond }) => {
    await ack();
    await respond({ 
        text:
        `Commands:
        /hendra-ping - speed
        /hendra - huh
        /hendra-help`
    })
});

(async () => {
    await app.start();
    console.log("Hendra is awake!")
})();