import { Client, Events, GatewayIntentBits, Guild } from "discord.js";

import { env } from "./env";
import { gracefulShutdown, Job, scheduleJob } from "node-schedule";
import { ConfigInterface } from "./ConfigInterface";
import { playSound } from "./sound-system";
import { join as pathJoin } from "node:path";
import { findFirstTalkableChannel } from "./utils";

export const config = require(pathJoin(
  process.cwd(),
  "config",
  "config.json"
)) as ConfigInterface;

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
export const jobs: Job[] = [];

client.once(Events.ClientReady, async () => {
  await setupGuilds();
  console.log("Discord bot is ready! 🤖");
});

client.on(Events.GuildCreate, async (guild) => {
  console.log("Joined a new guild: " + guild.name);
  await setupGuilds();
});

client.on(Events.GuildDelete, async (guild) => {
  console.log("Quit a guild: " + guild.name);
  await setupGuilds();
});

async function setupGuilds() {
  await gracefulShutdown(); //Cancel all jobs
  for (const [_, guild] of client.guilds.cache) {
    console.log(`setting up for guild ${guild.id}, "${guild.name}"`);
    const channel = findFirstTalkableChannel(guild)!;
    console.log(`  channel "${channel.name}"`);

    for (const sound of config.sounds) {
      jobs.push(
        scheduleJob(guild.id + ":" + sound.name, sound.schedule, () => {
          playSound(guild, channel.id, pathJoin("sounds", sound.name));
        })
      );
    }
  }
}

client.login(env.DISCORD_TOKEN);
