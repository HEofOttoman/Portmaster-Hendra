// require("dotenv").config();

import { App, onlyViewActions } from "@slack/bolt";

import "@std/dotenv/load";
import process from "node:process"; // <- Added because NodeJS process global is discouraged in Deno

import { getCurrentWeather } from "./modules/weather.ts"; // oh i forgor the ./
// import PROMPT from "prompt.md"
type TriggerType = "ping"; // from gorkie

interface Trigger {
  type: TriggerType;
  info: string | string[];
}

const ownerID = process.env.OWNER_UUID; // Aka allowedUser
const botToken = process.env.SLACK_BOT_TOKEN;
const appToken = process.env.SLACK_APP_TOKEN;
const ownedChannels = ["C0AMVTVLH4Y","C0BB6HQDUBE"];

if (!botToken || !appToken || !ownerID) { // Missing env safeguard
  throw new Error("Missing environment variables. Check for your bot & app tokens.");
}

const app = new App({
  token: botToken,
  appToken,
  socketMode: true,
});

// import app_home from "./modules/app_home.json" with { type: "json" };
app.event("app_home_opened", async ({ event, client, logger }) => {
  try {
    // await homeview;
    
    await client.views.publish({
      user_id: event.user,
      view:  //{ // inject app_home.json here
        // type: "home",
        // blocks: [
        //   {
        //     type: "header",
        //     text: { type: "plain_text", text: "This is app home."}
            
        //   }
        // ],
      //}
      {
      "type": "home",
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Hendra",
            "emoji": true
          },
          // "level": 1
        },
        {
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "niniii",
            "emoji": true
          },
          "image_url": "https://user-cdn.hackclub-assets.com/019fd13c-0b7c-7fc5-8e3f-ceb8f7c7d1ab/slack_n_hendra.png",
          "alt_text": "look at this beautiful guy 🥹"
        },
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Weather of the Ports",
            "emoji": true
          },
          // "level": 2
        },
        {
          "type": "divider"
        },
        {
          "type": "carousel",
          "elements": [
            {
              "type": "card",
              "block_id": "carousel-card-4",
              "icon": {
                "type": "image",
                "image_url": "https://picsum.photos/36/36",
                "alt_text": "Icon"
              },
              "title": {
                "type": "mrkdwn",
                "text": "New York",
                "verbatim": false
              },
              "subtitle": {
                "type": "mrkdwn",
                "text": "`${CurrentTime}`",
                "verbatim": false
              },
              "body": {
                "type": "mrkdwn",
                "text": "Current Temperature: ${currentTemp} \n Precipation: ${precipitation} \n ☀️/🌃",
                "verbatim": false
              }
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Embark?"
          },
          "accessory": {
            "type": "button",
            "style": "primary",
            "text": {
              "type": "plain_text",
              "text": "Sail.",
              "emoji": true
            },
            "value": "join_btn",
            "action_id": "button-action"
          }
        }
      ]
    }

    });

  } catch (error) {
    console.log(error);
    logger.error(error);
  }
});

app.command("/sailsouth", async ({ command, ack, respond, client }) => {
  await ack();
  
  await client.conversations.invite({
    users: command.user_id,
    channel: `C0AMVTVLH4Y`,
  });

})

app.command("/hendra", async ({ command, ack, respond }) => {
  await ack();
  await respond({ text: `yes what whar huh what? im up boss` });
});

app.command("/hendra-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `ugh fine. Pong!\nLatency: ${latency}ms` });
});

// put in chat.scheduleMessage somewhere

app.command("/weather-ports", async ({ command, ack, respond }) => {
  await ack();

  const msg = await getCurrentWeather();

  await respond({
    text: msg,
    // blocks: [],
  });
});

app.command("/hendra-help", async ({ command, ack, respond }) => {
  await ack();
  await respond({
    text: `Commands:
        /hendra-ping - speed
        /hendra - huh
        /hendra-help
        /weather-ports`,
  });
});

app.command("/hendra-channel", async ({ ack, command, respond }) => {
  await ack();
  if (
    command.user_id !== ownerID //||
    // !allowedChannels.includes(command.channel_id)
  ) {
    await respond("You don't have permission to run that.");
    return;
  }
  await respond({
    response_type: "in_channel",
    text: `<!channel> ${command.text}`,
  });
});

app.event("app_mention", async ({ event, say, client, logger }) => {
  try {
    console.log(event.user);

  } catch (error) {
    console.log(error);
  }
})

app.event("member_joined_channel", async ({ event, say, client, logger }) => {
  try {
    if (!ownedChannels.includes(event.channel)) {
      return;
    }
    
    // await client.chat.postMessage({
    //   channel: event.channel,
    //   text:
    //     `<@${event.user}> :wavey: Welcome to Henry's channel! <@${`U080F22CTJN`}>, greet your guest. Behave, or I might have to █████ ███ ██████ :>.`,
    // });
    // Not needed as long as private channels show you joined
  } catch (error) {
    logger.error("Error handling event:", error);
    console.log(error);
  }

  await dmOwner(ownerID, `User <@${event.user}> has joined your channel! :D`)

});

app.event("member_left_channel", async ({ event, say, client, logger }) => {
  try {
    await client.chat.postMessage({
      channel: event.channel,
      text: `bye...`,
    });

    await dmOwner(ownerID, `User <@${event.user}> has left your channel :<`)

  } catch (error) {
    logger.error("Error handling event:", error);
    console.log("Error handling event:", error);
  }
});

// Sends a DM to specified user. 
async function dmOwner(userID: string, text: string) {
  try {
    
    const result = await app.client.conversations.open({
      users: userID
    });
    
    const dmID = result.channel?.id;

    if (dmID) {
      await app.client.chat.postMessage({
        channel: dmID,
        text: text
      })
    } else {
      console.log('failed to fetch dm id');
    }

  } catch (error) {
    console.log(error);
  }
}

// const kv = Deno.openKv();

async function sendReminder(channelID: string, reminderName: string, reminderText: string, scheduledTime: string) {
  try {
    // await app.client.chat.postMessage({
    //   channel: channelID,
    //   text: `aye aye capt'n, scheduled reminder "${reminderText}" at ${scheduledTime}`,
    // })

    await app.client.chat.postMessage({
      channel: channelID,
      text: reminderText,
    })

    // await Deno.cron(reminderName, scheduledTime, () => {
    //   app.client.chat.postMessage({
    //   channel: channelID,
    //   text: reminderText,
    //   })
    // });
    
  } catch (error) {
    console.log(error);
  }
}

// Hardcoded daily things?
// sendReminder(`C0AMVTVLH4Y`, 'daily sendReminder', "hi!", '* * * *' );

// app.event("app_mention", async ({ event, say, client, logger}) => {})

(async () => {
  await app.start();
  console.log("Hendra is awake!");
})();
