# scheduled-discord-soundbot

work in progress, please don't try using this for now

Discord bot to play scheduled sounds
If you want to play sounds whenever you type a command, check out https://github.com/markokajzer/discord-soundbot -- It's great

## Installation

```
sudo apt update
sudo apt install -y ffmpeg
npm run build
npm run start
```

## TODO:

- Save new config.json on config change
- Per-guild schedules, timezone, locale
  - Thinking about using https://github.com/TryGhost/node-sqlite3, see below
- Slash command to set channel selection for guild
- Slash command to add sounds and set crontab (should be doable with a slash command SlashCommandBuilder.addAttachmentOption)
  - Name should be [A-z0-9]
  - Also deleting a sound (keep sound name separate from sound filename extension so it's easier for users)
- Suggested: If sound triggered but no one heard it, wait until someone comes in
- Rename this repo to something more meaningful (discord-scheduled-soundbot?)
- Localization

Unsupported:

- playing two sounds at the same schedule in the same guild

## _WIP_

Thought of this sql structure:

![sqldiagram](https://github.com/user-attachments/assets/01984721-05f7-4387-aa68-27afe0806265)
