import { Client, GatewayIntentBits } from "discord.js";

import { config } from "./config";
import { commands } from "./commands";
import { deployGuildCommands } from "./deploy-commands";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", async () => {
  console.log("Discord bot is ready! 🤖");
  await deployGuildCommands("<guildid>");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  const typedCommandName = commandName as keyof typeof commands;
  if (commands[typedCommandName]) {
    commands[typedCommandName].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
