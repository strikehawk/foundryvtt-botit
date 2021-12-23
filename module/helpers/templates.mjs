import { BOTIT } from "./config.mjs";

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([

    // Actor partials.
    `systems/${BOTIT.systemFolder}/templates/actor/parts/actor-attributes.html`,
    `systems/${BOTIT.systemFolder}/templates/actor/parts/actor-skills.html`,
    `systems/${BOTIT.systemFolder}/templates/actor/parts/actor-blank.html`,
    // `systems/${BOTIT.systemFolder}/templates/actor/parts/actor-talents.html`,
    // `systems/${BOTIT.systemFolder}/templates/actor/parts/actor-profile.html`,
    // `systems/${BOTIT.systemFolder}/templates/actor/parts/actor-skill-form.html`,
    // `systems/${BOTIT.systemFolder}/templates/actor/parts/actor-hero-sheet-full.html`,

    // // Item partials
    // `systems/${BOTIT.systemFolder}/templates/item/parts/item-profile-skills.html`,
    // `systems/${BOTIT.systemFolder}/templates/item/parts/item-profile-features.html`,
  ]);
};