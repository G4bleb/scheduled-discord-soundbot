PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS schedule;

DROP TABLE IF EXISTS guild;

DROP TABLE IF EXISTS sound;

CREATE TABLE
    sound (name VARCHAR(255) NOT NULL PRIMARY KEY);

CREATE TABLE
    guild (
        id VARCHAR(255) NOT NULL PRIMARY KEY,
        timezone VARCHAR(255) NOT NULL,
        locale VARCHAR(255) NOT NULL
    );

CREATE TABLE
    schedule (
        soundName VARCHAR(255) NOT NULL REFERENCES sound (name) ON DELETE CASCADE,
        guildId VARCHAR(255) NOT NULL REFERENCES guild (id) ON DELETE CASCADE,
        schedule VARCHAR(255) NOT NULL,
        PRIMARY KEY (soundName, guildId)
    );

INSERT INTO
    sound
VALUES
    ('lheure');

INSERT INTO
    guild
VALUES
    ('1234567891234567891', 'Europe/Paris', 'fr-FR');

INSERT INTO
    schedule
VALUES
    ('lheure', '1234567891234567891', '00 23 * * *');

SELECT
    soundName,
    schedule,
    locale
from
    schedule
    INNER JOIN guild ON schedule.guildId = guild.id;
