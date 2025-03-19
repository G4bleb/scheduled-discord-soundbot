import { join as pathJoin } from "node:path";
import fs from "node:fs";
import type { IncomingMessage } from "node:http";
import https from "node:https";

import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { parseExpression } from "cron-parser";

import {
  rebuildSoundMap,
  soundMap,
  SOUNDS_DIRECTORY,
} from "../utils/sounds-utils";
import { config, setSoundSchedule } from "../config";

const acceptedFileExtsArray = [".mp3", ".opus", ".ogg"];
const acceptedFileExts = new Set<string>(acceptedFileExtsArray);

export const data = new SlashCommandBuilder()
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setName("addsound")
  .setDescription("Add a scheduled sound")
  .addAttachmentOption((option) =>
    option
      .setName("sound")
      .setDescription("Attach sound file")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("schedule")
      .setDescription("The sound's schedule")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    console.error("Error: Missing guildId in command interaction");
    return;
  }
  const schedule = interaction.options.getString("schedule");
  try {
    if (!schedule) {
      throw new Error("Schedule is undefined");
    }
    parseExpression(schedule);
  } catch (error) {
    return interaction.reply(
      "Error: Schedule is invalid: " + (error as Error).message
    );
  }

  const attachment = interaction.options.getAttachment("sound");
  if (!attachment) {
    return interaction.reply("Error: Sound attachment is undefined");
  }

  // Validate file name
  const fileName = attachment.name.toLowerCase();
  const soundName = fileName.substring(0, fileName.lastIndexOf("."));
  if (soundName.match(/[^a-z0-9_]/)) {
    return interaction.reply(`Error: Sound name "${soundName}" is invalid`);
  }

  // Validate file extension
  const fileExt = fileName.substring(
    fileName.lastIndexOf("."),
    fileName.length
  );

  if (!acceptedFileExts.has(fileExt)) {
    return interaction.reply(
      `Error: file extension "${fileExt}" is invalid, compatible types are: ${acceptedFileExtsArray.join(
        ", "
      )}`
    );
  }

  // Validate file size
  if (attachment.size <= config.maximumFileSize) {
    return interaction.reply(
      `Error: file size of ${attachment.size} bytes is invalid, please attach a file < ${config.maximumFileSize}`
    );
  }

  // Validate that sound is unique
  if (soundName in soundMap) {
    return interaction.reply(`Error: Sound "${soundName}" already exists`);
  }

  // Download the sound
  const response = await new Promise<IncomingMessage>((resolve, reject) => {
    https.get(attachment.url).on("response", resolve).on("error", reject);
  });

  if (response.statusCode !== 200)
    return interaction.reply("Error: Failed to download the file");

  const fsStream = fs.createWriteStream(pathJoin(SOUNDS_DIRECTORY, fileName));
  response.pipe(fsStream);
  await new Promise((resolve) => fsStream.on("finish", resolve));
  await rebuildSoundMap();

  if (!setSoundSchedule(soundName, schedule)) {
    return interaction.reply(
      "Error: Failed to set new schedule, but sound is saved."
    );
  }

  return interaction.reply(
    `Sound ${soundName} added with schedule \`${schedule}\``
  );
}
