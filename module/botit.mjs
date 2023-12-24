// Import document classes.
import { BotitActor } from "./documents/actor.mjs";
import { BotitItem } from "./documents/item.mjs";
import { BotitCombat } from "./combat/combat.mjs";
import { BotitCombatTracker } from "./combat/combat-tracker.mjs";

// Import sheet classes.
import { BotitActorSheet } from "./sheets/actor-sheet.mjs";
import { BotitGenericActorSheet } from "./sheets/actor-generic-sheet.mjs";
import { BotitItemSheet } from "./sheets/item-sheet.mjs";

// Import helper/utility classes and constants.
import { HandlebarsHelpers } from "./helpers/handlebars-helpers.mjs";
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";

import { BOTIT } from "./helpers/config.mjs";
import { createSystemData } from "./data-creation/system-data-creator.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.botit = {
    BotitActor: BotitActor,
    BotitItem: BotitItem
  };

  // Add custom constants for configuration.
  /** @type {BotitSettings} */
  CONFIG.BOTIT = BOTIT;

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
  CONFIG.Combat.documentClass = BotitCombat;
  CONFIG.ui.combat = BotitCombatTracker;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("botit", BotitActorSheet, { makeDefault: true });
  Actors.registerSheet("botit", BotitGenericActorSheet, { makeDefault: false });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("botit", BotitItemSheet, { makeDefault: true });

  // Add custom Handlebars formatter
  HandlebarsHelpers.registerHelpers();

  // Preload Handlebars templates.
  await preloadHandlebarsTemplates();

  console.log("Botit | System Blade of the Iron Throne initialized.");
});

Hooks.once('ready', async function () {
  await createSystemData(BOTIT);
});