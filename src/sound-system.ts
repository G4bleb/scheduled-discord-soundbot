import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
} from "@discordjs/voice";
import { Guild } from "discord.js";

const player = createAudioPlayer();

export async function playSound(guild: Guild, channelId: string) {
  try {
    const connection = joinVoiceChannel({
      adapterCreator: guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
      channelId: channelId,
      guildId: guild.id,
    });

    const sound: string = "sounds/lheure.opus";
    const resource = createAudioResource(sound);

    connection.subscribe(player);

    return new Promise(() => {
      player.play(resource);
      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });
    });
  } catch (error) {
    console.error(error);
  }
}