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

- Add a slash command to configure config.json (schedule)
  - Runtime
  - Save new config.json
- Configure and save channel selection
- Live upload of sounds, with possible crontab edition (should be doable with a slash command SlashCommandBuilder.addAttachmentOption)
- Suggested: If sound triggered but no one heard it, wait until someone comes in
- Rename this repo to something more meaningful (discord-scheduled-soundbot?)
