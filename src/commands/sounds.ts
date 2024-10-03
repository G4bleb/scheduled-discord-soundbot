import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getNextPlay } from "../scheduling";
import { config } from "../config";

export const data = new SlashCommandBuilder()
  .setName("sounds")
  .setDescription("Lists the scheduled sounds");

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    console.error("missing guildId in sounds command");
    return;
  }
  return interaction.reply(soundsMessage(interaction.guildId));
}

function soundsMessage(guildId: string): string {
  const messageLines: string[] = [];
  for (const [name, { schedule }] of Object.entries(config.sounds)) {
    messageLines.push(name);
    messageLines.push(`\tSchedule:  ${schedule}`);
    messageLines.push(
      `\tNext play: ${getNextPlay(guildId, name).toLocaleString(config.locale, {
        timeZone: config.timezone,
      })} (${config.timezone})\n`
    );
  }
  return "```\n" + messageLines.join("\n") + "\n```";
}
