// require("dotenv").config();

import { App /*, onlyViewActions*/ } from "@slack/bolt";

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
const ownedChannels = ["C0AMVTVLH4Y", "C0BB6HQDUBE", "C0BNS59V22V"];

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
            "action_id": "join-t1"
            
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

app.action(`join-t1`, async ({ ack, body, client, logger}) => {
  await ack();
  try {

    // const joinResponse = await client.conversations.join({ channel: `C0AMVTVLH4Y` })
    const memberResponse = await client.conversations.members({ channel: `C0AMVTVLH4Y` });
    const isUserInChannel = memberResponse.members?.includes(body.user.id);
    if (isUserInChannel) {
      logger.warn(`User <@${body.user.id} attempted to join, but was in the channel.`);
    }

    await client.conversations.invite({
      users: body.user.id,
      channel: `C0AMVTVLH4Y`
    });
    
    dmOwner(body.user.id, `You've embarked. Arriving soon. To <#C0AMVTVLH4Y>.`)
    
    logger.info(`Added <@${body.user.id}> to pc via home page`)
    
    console.log(`User joined via button`);  
    } catch (error) {
      console.log(error);
    }  
})

app.action(`leave-ping`, async ({ ack, body, client, logger }) => {
  await ack();

  const groupUsers = await client.usergroups.users.list({
    usergroup: `S0ANEQMV7UJ`
  })

  const currentMembers = groupUsers.users;

  if (currentMembers?.includes(body.user.id)) {
    currentMembers.splice(currentMembers.indexOf(body.user.id, 1));
  } else {
    logger.warn("Member is/was not part of ping group");
  }

  await client.usergroups.users.update({
    usergroup: `S0ANEQMV7UJ`,
    users: currentMembers?.join(',')?? `` // Empty string fallback. 
  });

  // say(`Removed you from the ping group!`);
  logger.info(`Removed user <@${body.user.id}> from ping group`);
  dmOwner(ownerID, `User <@${body.user.id}> left <@S0ANEQMV7UJ> group.`);

})

app.command("/sailsouth", async ({ command, ack, respond, client }) => {
  await ack();
  
  await respond({ text: `You have invoked the coordinate. Sailing...` }) 
  
  await client.conversations.invite({
    users: command.user_id,
    channel: `C0AMVTVLH4Y`,
  });

})

app.command("/hendra", async ({ /*command,*/ ack, respond }) => {
  await ack();
  await respond({ text: `yes what whar huh what? im up boss` });
});

app.command("/hendra-ping", async ({ /*command,*/ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `yes boss. Pong!\nLatency: ${latency}ms` });
});

// put in chat.scheduleMessage somewhere

app.command("/weather-ports", async ({ /*command,*/ ack, respond }) => {
  await ack();

  const msg = await getCurrentWeather();

  await respond({
    text: msg,
    /*blocks: [
      {
        "subtitle": {
          "type": "mrkdwn",
          "text": `Requested by you, <@${command.user_id}>`
        }
      }
    ],*/
  });
});

app.command("/hendra-help", async ({ command, ack, respond }) => {
  await ack();
  await respond({
    text: `No problemo <@${command.user_id}>, here are my commands:
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
    console.log(` User ${event.user_profile?.name}, ID ${event.user} invoked me.`);

    await client.reactions.add({
      name: `canberraisbetterthansydney`,
      channel: event.channel,
      timestamp: event.ts
    });
    await say({
      text: `hi. yes?`, 
      thread_ts: event.event_ts
    });

  } catch (error) {
    console.log(error);
    logger.error("Error handling event:", error);
  }
})

app.event("member_joined_channel", async ({ event, /*say,*/ client, logger }) => {
  try {
    if (!ownedChannels.includes(event.channel)) {
      return; // Ignore any other channel
    }
    
    const groupUsers = await client.usergroups.users.list({
      usergroup: `S0ANEQMV7UJ`
    })

    if (groupUsers.users?.includes(event.user)) {
      console.log('User is already in the group.');
      // logger.warn(`User is already in the ping group`);
    } else {
      groupUsers.users?.push(event.user);
    }

    await client.usergroups.users.update({ // Add to client
      usergroup: `S0ANEQMV7UJ`,
      users: groupUsers.users?.join(',')?? ownerID // Always comma separate.
    });

    await client.chat.postEphemeral({
      user: event.user,
      channel: event.channel,
      text: `<@${event.user}>, welcome to henry's place. I've added you to his ping group.`,
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `<@${event.user}>, welcome to henry's place. I've added you to his ping group, click here to leave.`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "_exeunt!_"
          },
          "accessory": {
            "type": "button",
            "style": "primary",
            "text": {
              "type": "plain_text",
              "text": ":exit:",
              "emoji": true
            },
            "value": "leave_btn",
            "action_id": "leave-ping"
          }
        }
      ]
    });
    /* "accessory": {
            "type": "button",
            "style": "primary",
            "text": {
              "type": "plain_text",
              "text": "Sail.",
              "emoji": true
            },
            "value": "join_btn",
            "action_id": "button-action"
          }*/

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

  await dmOwner(ownerID, `User <@${event.user}> has joined your channel <#${event.channel}>! :D`)

});

app.event("member_left_channel", async ({ event, /*say, /*client,*/ logger }) => {
  try {
    // await say(`bye..`)

    await dmOwner(ownerID, `User <@${event.user}> has left <#${event.channel}> :<`)

  } catch (error) {
    logger.error("Error handling event:", error);
    console.log("Error handling event:", error);
  }
});

// Despite the name, this function sends a DM to specified user. 
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

// 0 0 * * *
Deno.cron("Update 365 days count", `0 0 * * *`, () => { // * * * * * would be every minute. Put that in for tests. It's also in UTC btw
  try {
    updateDayCount(`C0BNS59V22V`); // Public test channel
    updateDayCount(`C0A63BZ2AQN`); // 365 days channel
    updateDayCount(`C0AMVTVLH4Y`); // Personal channel
  } catch (error) {
    console.log(error);
  }
});
// const kv = Deno.openKv();

const dailyCounterRegex = /Day\s+(\d+)\/365/i; // This regex looks for a pattern of `Day x/365`, ignoring the following. 
// Dynamically access a day count from a channel topic using regex
async function updateDayCount(channel_id: string) {
  
  const daysInfo = await app.client.conversations.info({channel: channel_id});
  const currentTopic = daysInfo?.["channel"]?.["topic"]?.["value"];
  const regexMatch = currentTopic?.match(dailyCounterRegex);

  let dayCount;
  if (!regexMatch) { // guard against is possibly 'null' or 'undefined'.
    console.log("No match found");
    return;
  } else {
    dayCount = parseInt(regexMatch[1]);
  }
  const nextDay = 1 + dayCount;

  // const newTopic = currentTopic?.replace( /insertregexaqui/, currentTopic);
  const newTopic = currentTopic?.replace( dailyCounterRegex, `Day ${nextDay}/365`);

  const currentName = daysInfo?.["channel"]?.["name"];
  await app.client.conversations.setTopic({
    // twas 224
    topic: newTopic ?? `${currentTopic}`, // Nullish coalescing apparently thx goog
    channel: channel_id // Update 365 days
  })

  console.log(`Channel day count for #${currentName} (${channel_id}) successfully updated! Day ${nextDay}/365`)
}

/* async function sendReminder(channelID: string, reminderName: string, reminderText: string, scheduledTime: string) {
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
*/

// Hardcoded daily things?
// sendReminder(`C0AMVTVLH4Y`, 'daily sendReminder', "hi!", '* * * *' );

// app.event("app_mention", async ({ event, say, client, logger}) => {})

(async () => {
  await app.start();
  console.log("Hendra is awake!");
})();
