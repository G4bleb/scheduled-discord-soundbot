import { gracefulShutdown, scheduledJobs, scheduleJob } from "node-schedule";
import { playSound } from "./sound-system";
import { Channel, Guild } from "discord.js";
import { config, SoundConfig } from "./config";
import { getSoundPath, soundMap } from "./utils/sounds-utils";

export function scheduleSound(
  guild: Guild,
  channel: Channel,
  sound: SoundConfig
) {
  const jobName = guild.id + ":" + sound.name;
  if (!(sound.name in soundMap)) {
    console.error(
      `Error: could not schedule sound "${sound.name}" as it's not in soundMap, does the file exist ?`
    );
  }
  scheduleJob(
    jobName,
    {
      rule: sound.schedule,
      tz: config.timezone,
    },
    () => {
      playSound(guild, channel.id, getSoundPath(sound.name));
    }
  );
}

export async function cancelSchedule() {
  await gracefulShutdown(); //Cancel all jobs
}

export function getNextPlay(guildId: string, soundName: string): Date {
  const jobName = guildId + ":" + soundName;
  if (jobName in scheduledJobs) {
    return (
      scheduledJobs[guildId + ":" + soundName].nextInvocation() as unknown as {
        toDate: () => Date;
      }
    ).toDate();
  } else {
    return new Date(0);
  }
}
