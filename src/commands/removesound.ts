import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import fspromises from "node:fs/promises";
import { join as pathJoin } from "node:path";
import {
  rebuildSoundMap,
  soundMap,
  SOUNDS_DIRECTORY,
} from "../utils/sounds-utils";
import { soundRemoved } from "../config";

export const data = new SlashCommandBuilder()
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setName("removesound")
  .setDescription("Remove a scheduled sound")
  .addStringOption((option) =>
    option
      .setName("sound")
      .setDescription("The sound to remove")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    console.error("Error: Missing guildId in settimezone command");
    return;
  }

  const soundName = interaction.options.getString("sound");
  if (!soundName || !(soundName in soundMap)) {
    return interaction.reply("Error: Sound name is invalid");
  }

  await fspromises.rm(pathJoin(SOUNDS_DIRECTORY, soundMap[soundName]));
  await rebuildSoundMap();

  soundRemoved(soundName);

  return interaction.reply(`Sound "${soundName}" removed`);
}
