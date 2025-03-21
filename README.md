# scheduled-discord-soundbot

Discord bot to play sounds based on a crontab schedule 

This project works, but it's unpolished.
If you want to play sounds whenever you type a command, check out https://github.com/markokajzer/discord-soundbot -- It's great

## Installation

```
sudo apt update
sudo apt install -y ffmpeg
npm run build
npm run start
```

## TODO:

- Consider per-guild schedules , timezone, locale
  - Thinking about using https://github.com/TryGhost/node-sqlite3, see below
- Slash command to set channel selection for guild (implies a per-guild config)

- Rename this repo to something better
- Localization
- Tests.

- Suggested: If sound triggered but no one heard it, wait until someone comes in

Unsupported:

- playing two sounds at the same schedule in the same guild

## _WIP_

Thought of this sql structure:

![sqldiagram](https://github.com/user-attachments/assets/01984721-05f7-4387-aa68-27afe0806265)
