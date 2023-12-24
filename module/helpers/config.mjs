/** @typedef {import("@league-of-foundry-developers/foundry-vtt-types")} */
/** @typedef {import("../model/armors.mjs").Armor} Armor */
/** @typedef {import("../model/armors.mjs").ArmorType} ArmorType */
/** @typedef {import("../model/armors.mjs").ArmorMaterial} ArmorMaterial */
/** @typedef {import("../model/attributes.mjs").Attribute} Attribute */
/** @typedef {import("../model/body-locations.mjs").BodyLocation} BodyLocation */
/** @typedef {import("../model/body-locations.mjs").BodyZone} BodyZone */
/** @typedef {import("../model/proficiencies.mjs").Proficiency} Proficiency */
/** @typedef {import("../model/skills.mjs").Skill} Skill */

import attributesData from "../../data/attributes.json" assert { type: "json" };
import skillsData from "../../data/skills.json" assert { type: "json" };
import proficienciesData from "../../data/proficiencies.json" assert { type: "json" };
import armorPartsData from "../../data/armor-parts.json" assert { type: "json" };
import armorMaterialsData from "../../data/armor-materials.json" assert { type: "json" };
import armorsData from "../../data/armors.json" assert { type: "json" };

import { TalentsConfig } from "./talents-config.mjs";

export class BotitSettings {
  /**
   * @property The name of the folder containing the system.
   * 
   * @type {string}
   * @memberof BotitSettings
   */
  get systemFolder() {
    return "blade-iron-throne";
  }

  /**
   * @property The set of Attributes used within the system.
   * 
   * @type {Object.<string, Attribute>}
   * @memberof BotitSettings
   */
  get attributes() {
    return this._attributes;
  }

  /**
   * @property The set of Skills used within the system.
   * 
   * @type {Object.<string, Skill>}
   * @memberof BotitSettings
   */
  get skills() {
    return this._skills;
  }

  /**
   * @property The set of Talents used within the system.
   * 
   * @type {TalentsConfig}
   * @memberof BotitSettings
   */
  get talents() {
    return this._talents;
  }

  /**
   * @property The set of Proficiencies.
   * 
   * @type {Object.<string, Proficiency>}
   * @memberof BotitSettings
   */
  get proficiencies() {
    return this._proficiencies;
  }

  /**
   * @property The set of ArmorParts.
   * 
   * @type {Object.<string, ArmorType>}
   * @memberof BotitSettings
   */
  get armorParts() {
    return this._armorParts;
  }

  /**
   * @property The set of ArmorMaterials.
   * 
   * @type {Object.<string, ArmorMaterial>}
   * @memberof BotitSettings
   */
  get armorMaterials() {
    return this._armorMaterials;
  }

  /**
   * @property The set of Armors.
   * 
   * @type {Object.<string, Armor>}
   * @memberof BotitSettings
   */
  get armors() {
    return this._armors;
  }

  /**
   * @property The list of values supported by the game system.
   * 
   * @type {Map<string, SystemValue>}
   * @memberof BotitSettings
   */
  values;

  /**
   * @property The possible damage types in the game system.
   * 
   * @type {Object.<string, string>}
   * @memberof BotitSettings
   */
  get damageTypes() {
    return this._damageTypes;
  }

  constructor() {
    this._attributes = this._loadAttributes();
    this._skills = this._loadSkills();
    this._talents = new TalentsConfig();
    this._proficiencies = this._loadProficiencies();
    this._armorParts = this._loadArmorParts();
    this._armorMaterials = this._loadArmorMaterials();
    this._armors = this._loadArmors();

    this._damageTypes = {
      PIERCING: "piercing",
      BLUNT: "blunt",
      CLEAVING: "cleaving"
    };
  }

  _loadAttributes() {
    const attributes = {};

    for (const attribute of attributesData) {
      attributes[attribute.key] = attribute;
    }

    return attributes;
  }

  _loadSkills() {
    const skills = {};

    for (const skill of skillsData) {
      skills[skill.key] = skill;
    }

    return skills;
  }

  _loadProficiencies() {
    const proficiencies = {};

    for (const prof of proficienciesData) {
      proficiencies[prof.key] = prof;
    }

    return proficiencies;
  }

  _loadArmorParts() {
    const armorParts = {};

    for (const type of armorPartsData) {
      armorParts[type.key] = type;
    }

    return armorParts;
  }

  _loadArmorMaterials() {
    const armorMaterials = {};

    for (const material of armorMaterialsData) {
      armorMaterials[material.key] = material;
    }

    return armorMaterials;
  }

  _loadArmors() {
    const armors = {};

    for (const armor of armorsData) {
      armors[armor.label] = armor;
    }

    return armors;
  }
}


/**
 * An object containing static data for the game system.
 * @type {BotitSettings}
 */
export const BOTIT = new BotitSettings();