import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { getSound, SoundConfig } from "../config";
import { parseExpression } from "cron-parser";
import { setSound } from "../config";

export const data = new SlashCommandBuilder()
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setName("schedule")
  .setDescription("Set a sound's schedule")
  .addStringOption((option) =>
    option
      .setName("sound")
      .setDescription("The sound to schedule")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("schedule")
      .setDescription("The new schedule")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    console.error("Error: Missing guildId in settimezone command");
    return;
  }
  const schedule = interaction.options.getString("schedule");
  try {
    if (!schedule) {
      throw new Error("Schedule is undefined");
    }
    parseExpression(schedule)
  } catch (error) {
    return interaction.reply("Error: Schedule is invalid: " + (error as Error).message);
  }

  const soundName = interaction.options.getString("sound");
  let sound: SoundConfig | undefined = undefined;
  if (
    !soundName ||
    !(sound = getSound(soundName))
  ) {
    return interaction.reply("Error: Sound name is invalid");
  }

  sound.schedule = schedule;
  if(!setSound(soundName, sound)){
    return interaction.reply("Error: Failed to set new schedule");
  } 

  return interaction.reply(`Sound ${soundName} scheduled to \`${schedule}\``);
}
