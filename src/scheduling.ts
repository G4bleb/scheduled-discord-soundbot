
import { join as pathJoin } from "node:path";
import { gracefulShutdown, Job, scheduleJob } from "node-schedule";
import { playSound } from "./sound-system";
import { Channel, Guild } from "discord.js";
import { SoundConfig } from "./config";

export const jobs: Job[] = [];

export function scheduleSound(guild: Guild, channel:Channel, sound:SoundConfig, ){
  jobs.push(
    scheduleJob(guild.id + ":" + sound.name, sound.schedule, () => {
      playSound(guild, channel.id, pathJoin("sounds", sound.name));
    })
  );
}

export async function cancelSchedule(){
  await gracefulShutdown(); //Cancel all jobs
}
