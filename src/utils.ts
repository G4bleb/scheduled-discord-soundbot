import {
  ChannelType,
  Guild,
  PermissionFlagsBits,
  VoiceChannel,
} from "discord.js";

export function findFirstTalkableChannel(guild: Guild) {
  if (!guild.members.me) return undefined;

  const channels = guild.channels.cache
    .filter((channel) => channel.type === ChannelType.GuildVoice)
    .sort((first, second) => first.position - second.position)
    .filter((channel) => {
      const permissions = channel.permissionsFor(guild.members.me!);

      return Boolean(
        permissions.has(PermissionFlagsBits.Connect) &&
          permissions.has(PermissionFlagsBits.Speak)
      );
    });

  if (!channels.size) return undefined;
  return channels.first() as VoiceChannel;
}
