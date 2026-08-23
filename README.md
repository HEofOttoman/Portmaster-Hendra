# Portmaster Hendra
![hendra aww look at him so tired](https://cdn.hackclub.com/019fd13c-0b7c-7fc5-8e3f-ceb8f7c7d1ab/slack_n_hendra.png)

An assistant & bot for my personal Slack channel, made using the Slack BoltJS
SDK. I use Deno because why not.

> [!Warning] 
> This project uses Deno.cron(), which has the warning:
> *Warning: This is an unstable API that is subject to change or removal at any time.*

## Features

- Fetches weather for hmm important 'port' locations yes
- ~~Reminders~~
- Daily counter incrementation via regex (very specific). (Should move to Temporal API)
- Joining & leaving logging

## Deploying
1. Install Deno, `deno init`, and its dependencies, `deno install`.
2. Run the following command
```deno run --unstable-cron index.ts```
3. Accept all requested permissions

## Contributors

- Henry Wauzivuff
- sonion it's me
- AI used for answering why the timestamps didn't line up and also for the *regex*


Inspired by gork, gorkie & warden
