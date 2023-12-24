import { BOTIT } from "../helpers/config.mjs";

export class ActorProficienciesManager {
  static getCollection(context) {
    const actor = context.document;

    // ActorProficienciesManager.setDefaultedProficiencies(context.data);

    const collection = foundry.utils.deepClone(BOTIT.proficiencies);
    const currentValues = actor.system.proficiencies;
    const defaultedValues = actor.system.defaultedProficiencies;

    for (const [k, v] of Object.entries(collection)) {
      v.value = Math.max(currentValues[k] || 0, defaultedValues[k] || 0);
    }

    return collection;
  }

  static setDefaultedProficiencies(data) {
    const proficiencies = BOTIT.proficiencies;
    const actorProf = data.proficiencies;
    const currentValuesMap = new Map();
    for (const [k, v] of Object.entries(actorProf)) {
      currentValuesMap.set(k, v);
    }

    const actorDefaultedProf = {};
    data.defaultedProficiencies = actorDefaultedProf;

    const hasActorProf = function (key) {
      return typeof actorProf[key] === "number";
    };

    const getCurrentValue = function (key) {
      const currentValue = typeof actorProf[key] === "number" ? actorProf[key] : 0;
      const defaultedValue = typeof actorDefaultedProf[key] === "number" ? actorDefaultedProf[key] : 0;

      return Math.max(currentValue, defaultedValue);
    };

    let value;
    let currentValue;
    let defaultedValue;
    for (const prof of Object.values(proficiencies)) {
      currentValue = 0;

      if (currentValuesMap.has(prof.key)) {
        currentValue = currentValuesMap.get(prof.key);
      }

      // Try to create all defaults for to this proficiency and keep the highest
      defaultedValue = 0;
      for (const [k, v] of Object.entries(prof.defaults)) {
        value = currentValuesMap.get(k) || 0;
        if (defaultedValue < value + v) {
          defaultedValue = value + v;
          actorDefaultedProf[prof.key] = defaultedValue;
        }
      }

      // if (hasActorProf(prof.key)) {
      //   // Actor has the proficiency. No need to search for a default.
      //   value = actorProf[prof.key];

      //   // Try to create all defaults associated to this proficiency
      //   for (const [k, v] of Object.entries(prof.defaults)) {
      //     defaultedValue = value + v;

      //     if (defaultedValue <= 0) {
      //       continue;
      //     }

      //     currentValue = getCurrentValue(k);

      //     if (currentValue < defaultedValue) {
      //       actorDefaultedProf[k] = defaultedValue;
      //     }
      //   }
      // }
    }
  }
}