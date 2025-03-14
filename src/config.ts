import { join as pathJoin } from "node:path";
import { setupGuilds } from ".";

export interface SoundConfig {
  name: string;
  schedule: string;
}

export interface Config {
  activityName: string;
  timezone: string;
  locale: string;
}

interface Sounds {
  [soundName: string]: { schedule: string };
}

export const config = require(pathJoin(
  process.cwd(),
  "config",
  "config.json"
)) as Config;

export const sounds = require(pathJoin(
  process.cwd(),
  "config",
  "sounds.json"
)) as Sounds;

export function setTimezone(newTimezone: string) {
  config.timezone = newTimezone;
  setupGuilds();
}

export function getSoundSchedule(
  soundName: string
): { schedule: string } | undefined {
  return sounds[soundName];
}

export function setSoundSchedule(
  soundName: string,
  newSchedule: string
): boolean {
  if (!(soundName in sounds)) {
    return false;
  }
  sounds[soundName] = { schedule: newSchedule };
  setupGuilds();
  return true;
}
