# sound-playing-discord-bot

work in progress, please don't try using this for now

Discord bot to play scheduled sounds

you need ffmpeg to play sounds

```
sudo apt update
sudo apt install -y ffmpeg
npm install
npm run dev
```

Parts of code copied from https://github.com/markokajzer/discord-soundbot -- great bot, use it instead of this crappy one

TODO:

- Set config (schedule) at runtime
  - Should save new config.json
- Per-guild sounds, schedules
- Slash command to set channel selection for guild
- Slash command to set timezone for guild ()
- Slash command to of sounds and set crontab (should be doable with a slash command SlashCommandBuilder.addAttachmentOption)
  - Also deleting a sound (keep sound name separate from sound filename so it's easier for users)
- Slash command to with configure crontab of sound
- Suggested: If sound triggered but no one heard it, wait until someone comes in
- Rename this repo to something more meaningful (discord-scheduled-soundbot?)
- Localization
- Like discord-soundbot's soundutils, save only sounds names and find them in soudns folder when needed

Unsupported:

- playing two sounds at the same schedule in the same guild
