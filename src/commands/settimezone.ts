import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { isTimezoneValid } from "../utils/js-utils";
import { setTimezone } from "../config";

export const data = new SlashCommandBuilder()
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setName("settimezone")
  .setDescription("Set the bot's timezone for scheduling")
  .addStringOption((option) =>
    option
      .setName("timezone")
      .setDescription("The new timezone")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    console.error("Error: Missing guildId in settimezone command");
    return;
  }
  const tz = interaction.options.getString("timezone");
  if (!tz || !isTimezoneValid(tz)) {
    return interaction.reply("Error: Timezone provided is invalid");
  }
  setTimezone(tz);
  return interaction.reply(`Timezone set to ${tz}`);
}
