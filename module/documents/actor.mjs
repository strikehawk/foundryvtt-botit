import { BOTIT } from "../helpers/config.mjs";
import { ActorArmorManager } from "./actor-armor.manager.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class BotitActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /** @override */
  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();

    this.data.data.armorSet = ActorArmorManager.getArmorSet(this);
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.boilerplate || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareHeroData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareHeroData(actorData) {
    if (actorData.type !== 'hero') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    // this._setFakeData(data);
    this._getDerivedAttributes(data);
    this._getDefaultedProficiencies(data);
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getHeroRollData(data);

    return data;
  }

  _setFakeData(data) {
    if (data.fake) {
      return;
    }

    const bio = {
      culture: "Nordlander",
      gender: "Male",
      height: 1.86,
      weight: 89
    };
    data.bio = bio;

    data.lootLevel = 0;

    const passions = {
      "1": { label: "Passion 1", value: 1 },
      "2": { label: "Passion 2", value: 2 },
      "3": { label: "Passion 3", value: 3 },
      "4": { label: "Passion 4", value: 4 },
      drama: 5
    };
    data.passions = passions;

    data.fake = true;
  }

  _getDerivedAttributes(data) {
    const att = data.attributes;
    const derivedAttributes = {};
    data.derivedAttributes = derivedAttributes;
  
    derivedAttributes.reflex = Math.ceil((att.cunning + att.daring) / 2);
    derivedAttributes.aim = Math.ceil((att.sagacity + att.cunning) / 2);
    derivedAttributes.knockdown = Math.ceil((att.brawn + att.daring) / 2);
    derivedAttributes.knockout = Math.ceil((att.brawn + att.tenacity) / 2);
    derivedAttributes.move = Math.ceil((att.brawn + att.cunning + att.daring) / 3);

    // TODO missing bonus due to known Mysteries
    derivedAttributes.power = Math.ceil((att.sagacity + att.tenacity + att.brawn) / 3);
  }

  _getDefaultedProficiencies(data) {
    const proficiencies = BOTIT.proficiencies;
    const actorProf = data.proficiencies;
    const actorDefaultedProf = {};
    data.defaultedProficiencies = actorDefaultedProf;

    const hasActorProf = function(key) {
      return typeof actorProf[key] === "number";
    };

    const getCurrentValue = function(key) {
      const currentValue = typeof actorProf[key] === "number" ? actorProf[key] : 0;
      const defaultedValue = typeof actorDefaultedProf[key] === "number" ? actorDefaultedProf[key] : 0;

      return Math.max(currentValue, defaultedValue);
    };

    let value;
    let currentValue;
    let defaultedValue;
    for (const prof of Object.values(proficiencies)) {
      if (hasActorProf(prof.key)) {
        // Actor has the proficiency. No need to search for a default.
        value = actorProf[prof.key];

        // Try to create all defaults associated to this proficiency
        for (const [k, v] of Object.entries(prof.defaults)) {
          defaultedValue = value + v;
          
          if (defaultedValue <= 0) {
            continue;
          }

          currentValue = getCurrentValue(k);

          if (currentValue < defaultedValue) {
            actorDefaultedProf[k] = defaultedValue;
          }
        }
      }
    }
  }

  /**
   * Prepare character roll data.
   */
  _getHeroRollData(data) {
    if (this.data.type !== 'hero') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.skills) {
      for (let [k, v] of Object.entries(data.skills)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
  }

}