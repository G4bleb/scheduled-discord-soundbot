import { join as pathJoin } from "node:path";
import { setupGuilds } from ".";
import fspromises from "node:fs/promises";

const CONFIG_JSON_PATH = pathJoin(
  process.cwd(),
  "config",
  "config.json"
);
const SOUNDS_JSON_PATH = pathJoin(
  process.cwd(),
  "config",
  "sounds.json"
);

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

export const config = require(CONFIG_JSON_PATH) as Config;
export const sounds = require(SOUNDS_JSON_PATH) as Sounds;

export function setTimezone(newTimezone: string) {
  config.timezone = newTimezone;
  saveConfigJson();
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
  saveSoundsJson();
  setupGuilds();
  return true;
}

async function saveSoundsJson(){
  console.log(`Saving sounds.json...`);
  await fspromises.writeFile(SOUNDS_JSON_PATH, JSON.stringify(sounds, null, 2));
  console.log(`Saved sounds.json`)
}

async function saveConfigJson(){
  console.log(`Saving config.json`);
  await fspromises.writeFile(CONFIG_JSON_PATH, JSON.stringify(config, null, 2));
  console.log(`Saved config.json`)
}
