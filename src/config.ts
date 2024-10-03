import { join as pathJoin } from "node:path";
import { setupGuilds } from ".";

export interface SoundConfig {
  name: string;
  schedule: string;
}

export interface Config {
  activityName: string;
  sounds: SoundConfig[];
  timezone: string;
  locale: string;
}

export const config = require(pathJoin(
  process.cwd(),
  "config",
  "config.json"
)) as Config;

export function setTimezone(newTimezone: string){
  config.timezone = newTimezone;
  setupGuilds();
}

export function getSound(soundName: string) {
  return config.sounds.find((s) => s.name == soundName);
}

export function setSound(soundName: string, newSound: SoundConfig): boolean {
  const i = config.sounds.findIndex((s) => s.name == soundName);
  if (i == -1) {
    return false;
  }
  config.sounds[i] = newSound;
  setupGuilds();
  return true;
}
