# Portmaster Hendra
![hendra, aww look at him so tired](https://cdn.hackclub.com/019fd13c-0b7c-7fc5-8e3f-ceb8f7c7d1ab/slack_n_hendra.png)

An assistant & bot for my personal Slack channel, made using the Slack BoltJS
SDK & Deno. I use Deno because why not.

> [!Warning] 
> To schedule tasks, this project uses `Deno.cron()`, which itself is attached the warning:
> >*Warning: This is an unstable API that is subject to change or removal at any time.*

## Features

- Fetches weather for hmm important 'port' locations yes
- ~~Reminders~~ Maybe of some sort
- Daily counter incrementation via regex (very specific). (Should move to Temporal API)
- Joining & leaving logging via DMing to the owner, and also welcoming
- App home page with the information

### Commands List
1. `/hendra-help`
2. `/hendra-channel`
3. `/hendra-ping`
4. `/sailsouth` - Joins the channel

## Deploying
1. Install Deno, `deno init`, and its dependencies, `deno install`.
2. Create a `.env` file using `.env.example`, inserting your own tokens as needed. 
3. Run the following command:
```deno run index.ts```
    >The `--unstable-cron` flag is pre-defined in `deno.json`
4. Accept all requested permissions
5. Do what you need to do!

<!-- ## Gallery

-->

## Contributors

- Henry Wauzivuff
- sonion it's me
- AI used for answering why the timestamps didn't line up and also for the *regex*


Inspired by gork, gorkie & warden
