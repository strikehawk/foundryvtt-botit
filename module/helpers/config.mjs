import attributesData from "../../data/attributes.json" assert { type: "json" };
import skillsData from "../../data/skills.json" assert { type: "json" };
import proficienciesData from "../../data/proficiencies.json" assert { type: "json" };
import bodyLocationsData from "../../data/body-locations.json" assert { type: "json" };
import armorPartsData from "../../data/armor-parts.json" assert { type: "json" };
import armorMaterialsData from "../../data/armor-materials.json" assert { type: "json" };
import armorsData from "../../data/armors.json" assert { type: "json" };

import { TalentsConfig } from "./talents-config.mjs";

export class Attribute {
  /**
   * @property The unique identifier of the attribute.
   * 
   * @type {string}
   * @memberof Attribute
   */
  key;

  /**
   * @property The label of the attribute.
   * 
   * @type {string}
   * @memberof Attribute
   */
  label;

  /**
   * @property The short name of the attribute.
   * 
   * @type {string}
   * @memberof Attribute
   */
  abbreviation;

  /**
   * @property The description of the attribute.
   * 
   * @type {string}
   * @memberof Attribute
   */
  description;
}

export class Skill {
  /**
   * @property The unique identifier of the skill.
   * 
   * @type {string}
   * @memberof Skill
   */
  key;

  /**
   * @property The label of the skill.
   * 
   * @type {string}
   * @memberof Skill
   */
  label;

  /**
   * @property The attribute mainly used with this skill.
   * 
   * @type {string}
   * @memberof Skill
   */
  attribute;

  /**
   * @property The description of the skill.
   * 
   * @type {string}
   * @memberof Skill
   */
  description;
}

export class Proficiency {
  /**
 * @property The unique identifier of the proficiency.
 * 
 * @type {string}
 * @memberof Proficiency
 */
  key;

  /**
   * @property The label of the proficiency.
   * 
   * @type {string}
   * @memberof Proficiency
   */
  label;

  /**
   * @property The description of the proficiency.
   * 
   * @type {string}
   * @memberof Proficiency
   */
  description;

  /**
   * @property True if the proficiency uses a ranged weapon; false otherwise.
   * 
   * @type {boolean}
   * @memberof Proficiency
   */
  ranged;

  /**
   * @property The default value of the proficiency based on other proficiencies.
   * 
   * @type {Object.<string, number>}
   * @memberof Proficiency
   */
  defaults;
}

export class BodyLocation {
  /**
  * @property The unique identifier of the BodyLocation.
  * 
  * @type {string}
  * @memberof BodyLocation
  */
  key;

  /**
   * @property The label of the BodyLocation.
   * 
   * @type {string}
   * @memberof BodyLocation
   */
  label;

  /**
   * @property The side of the location, 'left' or 'right'.
   * 
   * @type {string}
   * @memberof BodyLocation
   */
  side;
}

export class ArmorType {
  /**
  * @property The unique identifier of the ArmorType.
  * 
  * @type {string}
  * @memberof ArmorType
  */
  key;

  /**
   * @property The label of the ArmorType.
   * 
   * @type {string}
   * @memberof ArmorType
   */
  label;

  /**
   * @property The description of the ArmorType.
   * 
   * @type {string}
   * @memberof ArmorType
   */
  description;

  /**
   * @property The list of BodyLocation keys protected by this ArmorType.
   * 
   * @type {string[]}
   * @memberof ArmorType
   */
  zones;
}

export class ArmorMaterial {
  /**
  * @property The unique identifier of the ArmorMaterial.
  * 
  * @type {string}
  * @memberof ArmorMaterial
  */
  key;

  /**
   * @property The label of the ArmorMaterial.
   * 
   * @type {string}
   * @memberof ArmorMaterial
   */
  label;

  /**
   * @property The description of the ArmorMaterial.
   * 
   * @type {string}
   * @memberof ArmorMaterial
   */
  description;

  /**
   * @property The protection offered by this ArmorMaterial against Piercing damage.
   * 
   * @type {number}
   * @memberof ArmorMaterial
   */
  piercing;

  /**
   * @property The protection offered by this ArmorMaterial against Blunt damage.
   * 
   * @type {number}
   * @memberof ArmorMaterial
   */
  blunt;

  /**
   * @property The protection offered by this ArmorMaterial against Cleaving damage. If null, no Cleaving damage can be sustained when protected by this armor material.
   * 
   * @type {number}
   * @memberof ArmorMaterial
   */
  cleaving;

  /**
   * @property An abstraction of the efficiency level of this armor material.
   * 
   * @type {number}
   * @memberof ArmorMaterial
   */
  efficiency;
}

export class Armor {
  /**
   * @property The label of the Armor.
   * 
   * @type {string}
   * @memberof Armor
   */
  label;

  /**
   * @property The description of the Armor.
   * 
   * @type {string}
   * @memberof Armor
   */
  description;

  /**
   * @property The shape of the armor (the `key` of an Armor Part).
   * 
   * @type {string}
   * @memberof Armor
   */
  part;

  /**
   * @property The material of the armor (the `key` of an Armor Material).
   * 
   * @type {string}
   * @memberof Armor
   */
  material;
}

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
   * @property The set of BodyLocations.
   * 
   * @type {Object.<string, BodyLocation>}
   * @memberof BotitSettings
   */
  get bodyLocations() {
    return this._bodyLocations;
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
    this._bodyLocations = this._loadBodyLocations();
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

  _loadBodyLocations() {
    const bodyLocations = {};

    for (const loc of bodyLocationsData) {
      bodyLocations[loc.key] = loc;
    }

    return bodyLocations;
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