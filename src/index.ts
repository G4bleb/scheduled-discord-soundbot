import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";

import { env } from "./env";
import { config } from "./config";
import { findFirstTalkableChannel } from "./utils/discord-utils";
import { cancelSchedule, scheduleSound } from "./scheduling";
import { deployGlobalCommands } from "./deploy-commands";
import { commands } from "./commands";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once(Events.ClientReady, async () => {
  client.user!.setActivity({
    type: ActivityType.Watching,
    name: config.activityName,
  });
  await deployGlobalCommands();
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

export async function setupGuilds() {
  await cancelSchedule();
  for (const [_, guild] of client.guilds.cache) {
    console.log(`setting up for guild ${guild.id}, "${guild.name}"`);
    const channel = findFirstTalkableChannel(guild)!;
    console.log(`\tchannel "${channel.name}"`);

    for (const sound of config.sounds) {
      scheduleSound(guild, channel, sound);
    }
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const { commandName } = interaction;
  const typedCommandName = commandName as keyof typeof commands;
  if (commands[typedCommandName]) {
    commands[typedCommandName].execute(interaction);
  }
});

client.login(env.DISCORD_TOKEN);
