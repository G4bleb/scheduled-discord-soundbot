import { join as pathJoin } from "node:path";
import { setupGuilds } from ".";

export interface SoundConfig {
  name: string;
  schedule: string;
}

export interface Config {
  activityName: string;
  sounds: { [soundName: string]: { schedule: string } };
  timezone: string;
  locale: string;
}

export const config = require(pathJoin(
  process.cwd(),
  "config",
  "config.json"
)) as Config;

export function setTimezone(newTimezone: string) {
  config.timezone = newTimezone;
  setupGuilds();
}

export function getSoundSchedule(soundName: string): { schedule: string } | undefined  {
  return config.sounds[soundName];
}

export function setSoundSchedule(soundName: string, newSchedule: string): boolean {
  if (!(soundName in config.sounds)) {
    return false;
  }
  config.sounds[soundName] = {schedule: newSchedule};
  setupGuilds();
  return true;
}
