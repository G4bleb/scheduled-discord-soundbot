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
