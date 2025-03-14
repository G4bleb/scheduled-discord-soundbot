import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { sounds, setSoundSchedule } from "../config";
import { parseExpression } from "cron-parser";

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
    parseExpression(schedule);
  } catch (error) {
    return interaction.reply(
      "Error: Schedule is invalid: " + (error as Error).message
    );
  }

  const soundName = interaction.options.getString("sound");
  if (!soundName || !(soundName in sounds)) {
    return interaction.reply("Error: Sound name is invalid");
  }

  if (!setSoundSchedule(soundName, schedule)) {
    return interaction.reply("Error: Failed to set new schedule");
  }

  return interaction.reply(`Sound ${soundName} scheduled to \`${schedule}\``);
}
