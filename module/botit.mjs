// Import document classes.
import { BotitActor } from "./documents/actor.mjs";
import { BotitItem } from "./documents/item.mjs";

// Import sheet classes.
import { BotitActorSheet } from "./sheets/actor-sheet.mjs";
import { BotitGenericActorSheet } from "./sheets/actor-generic-sheet.mjs";
import { BotitItemSheet } from "./sheets/item-sheet.mjs";

// Import helper/utility classes and constants.
import { HandlebarsHelpers } from "./helpers/handlebars-helpers.mjs";
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";

import { BOTIT } from "./helpers/config.mjs";
import { BotitSettings } from "./helpers/botit-settings.mjs";

/** @type {BotitSettings} */
const botitGlobal = BOTIT;

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.botit = {
    BotitActor: BotitActor,
    BotitItem: BotitItem
  };

  // Add custom constants for configuration.
  /** @type {BotitSettings} */
  CONFIG.BOTIT = botitGlobal;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = BotitActor;
  CONFIG.Item.documentClass = BotitItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("botit", BotitActorSheet, { makeDefault: true });
  Actors.registerSheet("botit", BotitGenericActorSheet, { makeDefault: false });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("botit", BotitItemSheet, { makeDefault: true });

  // Add custom Handlebars formatter
  HandlebarsHelpers.registerHelpers();

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});