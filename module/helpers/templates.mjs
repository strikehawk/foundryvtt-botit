import { BOTIT } from "./config.mjs";
import { BotitSettings } from "./botit-settings.mjs";
import { HandlebarsHelpers } from "./handlebars-helpers.mjs";

/** @type {BotitSettings} */
const botitGlobal = BOTIT;

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([

    // Actor partials.
    `systems/${botitGlobal.systemFolder}/templates/actor/parts/actor-combat.html`,
    `systems/${botitGlobal.systemFolder}/templates/actor/parts/actor-talents.html`,
    `systems/${botitGlobal.systemFolder}/templates/actor/parts/actor-profile.html`,
    `systems/${botitGlobal.systemFolder}/templates/actor/parts/actor-skills.html`,
    `systems/${botitGlobal.systemFolder}/templates/actor/parts/actor-skill-form.html`,
    `systems/${botitGlobal.systemFolder}/templates/actor/parts/actor-hero-sheet-full.html`,

    // Item partials
    `systems/${botitGlobal.systemFolder}/templates/item/parts/item-profile-skills.html`,
    `systems/${botitGlobal.systemFolder}/templates/item/parts/item-profile-features.html`,
  ]);
};