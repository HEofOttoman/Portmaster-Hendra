// require("dotenv").config();

// const { App } = require("@slack/bolt");
// import { App } from "npm:@slack/bolt";
import { App } from "@slack/bolt";

// import "jsr:@std/dotenv/load";
import "@std/dotenv/load";

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

app.event('reaction_added', async ({ event, say, client, logger }) => {
    try {

        const channelId = event.item.channel;
        const threadTs = event.item.ts;
        
        const message = await client.conversations.history({
            channel: channelId,
            latest: threadTs,
            inclusive: true,
            limit: 1, // We only want the message that was reacted to
        });

        const messageText = message.messages[0].text;

        const messages = [{role: 'user', content: messageText}];
        
        
        // Post a confirmation message in the thread
        const initialMessage = await say({
            text: `Hello, I'm a Code Assistant app working on your behalf! I'm asking AI your question: ${messageText}`,
            channel: channelId,
            thread_ts: threadTs, // This starts the thread if one doesn't exist
        });

        const initialMessageTs = initialMessage.ts;
        
        await say({
            text: 'ayo what',
            channel: channelId,
            thread_ts: initialMessageTs,
        });
    } catch (error) {
        logger.error('Error handling event:', error)
    }

});

(async () => {
    await app.start();
    console.log("Hendra is awake!")
})();