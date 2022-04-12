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

Hooks.once('ready', async function () {
  // _createSkills();
  // _createProficiencies();
  _createArmors();
});

async function _createSkills() {
  let folder = game.folders.find(f => f.type === "Item" && f.name === "Skills");
  if (!folder) {
    folder = await Folder.create({ name: "Skills", type: "Item" });
  }

  for (const i of game.items) {
    if (i.type !== "skill") {
      continue;
    }

    i.delete();
  }

  let item;
  let data;
  for (const skill of Object.values(BOTIT.skills)) {
    data = { 
      name: skill.label, 
      type: "skill", 
      img: "icons/svg/d20.svg",
      folder: folder.id, 
      data: foundry.utils.deepClone(skill) 
    };
  
    item = await Item.create(data);
  }
}

async function _createProficiencies() {
  let folder = game.folders.find(f => f.type === "Item" && f.name === "Proficiencies");
  if (!folder) {
    folder = await Folder.create({ name: "Proficiencies", type: "Item" });
  }

  for (const i of game.items) {
    if (i.type !== "proficiency") {
      continue;
    }

    i.delete();
  }

  let item;
  let data;
  for (const prof of Object.values(BOTIT.proficiencies)) {
    data = { 
      name: prof.label, 
      type: "proficiency", 
      img: "icons/svg/combat.svg",
      folder: folder.id, 
      data: foundry.utils.deepClone(prof) 
    };

    data.data.ranged = !!data.data.ranged;
  
    item = await Item.create(data);
  }
}

async function _createArmors() {
  let folder = game.folders.find(f => f.type === "Item" && f.name === "Armors");
  if (!folder) {
    folder = await Folder.create({ name: "Armors", type: "Item" });
  }

  for (const i of game.items) {
    if (i.type !== "armor") {
      continue;
    }

    i.delete();
  }

  let item;
  let data;
  for (const armor of Object.values(BOTIT.armors)) {
    data = { 
      name: armor.label, 
      type: "armor",
      folder: folder.id, 
      data: foundry.utils.deepClone(armor) 
    };

    data.data.equipped = false;
  
    item = await Item.create(data);
  }
}