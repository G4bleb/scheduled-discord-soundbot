import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";

import { env } from "./env";
import { config } from "./config";
import { findFirstTalkableChannel } from "./utils";
import { cancelSchedule, scheduleSound } from "./scheduling";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once(Events.ClientReady, async () => {
  client.user!.setActivity({
    type: ActivityType.Watching,
    name: config.activityName,
  });
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
  await cancelSchedule();
  for (const [_, guild] of client.guilds.cache) {
    console.log(`setting up for guild ${guild.id}, "${guild.name}"`);
    const channel = findFirstTalkableChannel(guild)!;
    console.log(`  channel "${channel.name}"`);

    for (const sound of config.sounds) {
      scheduleSound(guild, channel, sound);
    }
  }
}

client.login(env.DISCORD_TOKEN);
