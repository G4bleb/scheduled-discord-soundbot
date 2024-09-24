import fspromises from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";

export const SOUNDS_DIRECTORY = "sounds" + path.sep;
export var soundMap: { [name: string]: string } = {};

export const soundsDirWatcher = fs.watch(SOUNDS_DIRECTORY, () => {
  rebuildSoundMap();
});
rebuildSoundMap();

export async function rebuildSoundMap() {
  const dir = await fspromises.readdir(SOUNDS_DIRECTORY);
  const newSoundMap: typeof soundMap = {};

  let count = 0;
  for (const filename of dir) {
    const name = filename.split(".")[0];
    newSoundMap[name] = filename;
    count++;
  }
  console.log("Rebuilt sound map, size =", count);
  soundMap = newSoundMap;
}

export function getSoundPath(soundName: string) {
  if (!(soundName in soundMap)) {
    throw new Error(`Sound "${soundName}" not in soundMap`);
  }
  return path.join(SOUNDS_DIRECTORY, soundMap[soundName]);
}
