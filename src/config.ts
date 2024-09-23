import { join as pathJoin } from "node:path";

export interface SoundConfig {
  name: string;
  schedule: string;
}

export interface ConfigFile {
  activityName: string;
  sounds: { name: string; schedule: string }[];
  timezone: string;
}

export const config = require(pathJoin(
  process.cwd(),
  "config",
  "config.json"
)) as ConfigFile;
