import {
  ChannelType,
  CommandInteraction,
  Guild,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  VoiceChannel,
} from "discord.js";
import { playSound } from "../sound-system";

export const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("Test command")
  .setContexts([InteractionContextType.Guild]);

export async function execute(interaction: CommandInteraction) {
  if (!interaction.guild) {
    return interaction.reply("Error : interaction.guild is undefined");
  }
  const voiceChannel = findFirstTalkableChannel(interaction.guild);
  if (!voiceChannel) {
    return interaction.reply("Error : voiceChannel is undefined");
  }
  playSound(interaction.guild, voiceChannel.id);
  return interaction.reply("OK");
}

function findFirstTalkableChannel(guild: Guild) {
  if (!guild.members.me) return undefined;

  const channels = guild.channels.cache
    .filter((channel) => channel.type === ChannelType.GuildVoice)
    .filter((channel) => {
      const permissions = channel.permissionsFor(guild.members.me!);

      return Boolean(permissions?.has(PermissionFlagsBits.SendMessages));
    });

  if (!channels.size) return undefined;
  return channels.first() as VoiceChannel;
}
