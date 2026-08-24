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
- Joining & leaving logging via DMing to the owner, welcoming to the channel as well!
- App home page with some relevant information

### Commands List
1. `/hendra-help` - lists some of the commands
2. `/hendra-channel` - we have at-channel at home
3. `/hendra-ping` - checks latency
4. `/sailsouth` - Joins the channel
5. `/weather-ports` - Displays weather reports for 4 different locations.

## Deploying
1. Install Deno, `deno init`, and its dependencies, `deno install`.
2. Create a `.env` file using `.env.example`, inserting your own tokens as needed. 
3. Run the following command:
```deno run index.ts```
    >The `--unstable-cron` flag is pre-defined in `deno.json`
4. Accept all requested permissions
5. Do what you need to do!

6. To run it 24/7, persisting after restarts, enable the systemd service (or use screen).
    ```
    # Make service (take hendra.service from this repo)
    systemctl enable hendra.service --now
    # Check status of service
    systemctl status <name>.service
    # View logs of service
    journalctl -eu <name>
    ```
    >Taken from [Nest guides](https://guides.hackclub.app/index.php/Systemd) <3

## Gallery
![leave btn](https://cdn.hackclub.com/01a02f7a-24ba-7781-be60-a57f1e9f9ea9/image.png)

## Contributors

- Henry Wauzivuff
- sonion it's me
- AI used for answering why the openmeteo timestamps didn't line up and also for the *regex*


Inspired by gork, gorkie & warden
