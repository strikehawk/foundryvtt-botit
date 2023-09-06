/** @typedef {import("@league-of-foundry-developers/foundry-vtt-types")} */

import { BOTIT } from "../helpers/config.mjs";

import { ActorBehaviorBase } from "./actor.behavior.mjs";
import { BotitActor } from "./actor.mjs";
import { ActorArmorManager } from "./actor-armor.manager.mjs";

/** @type {BotitSettings} */
const botitGlobal = BOTIT;

export class ActorHeroBehavior extends ActorBehaviorBase {
    /**
     * 
     * @param {BotitActor} actor 
     */
    prepareEmbeddedDocuments(actor) {
        actor.system.armorSet = ActorArmorManager.getArmorSet(actor);
    }

    /**
     * Augment the basic actor data with additional dynamic data. Typically,
     * you'll want to handle most of your calculated/derived data in this step.
     * Data calculated in this step should generally not exist in template.json
     * (such as ability modifiers rather than ability scores) and should be
     * available both inside and outside of character sheets (such as if an actor
     * is queried and has a roll executed directly from it).
     * @param {BotitActor} actor 
     */
    prepareDerivedData(actor) {
        const data = actor.system;

        // this._setFakeData(data);
        this.#getDerivedAttributes(data);
        this.#getDefaultedProficiencies(data);
    }

    /**
     * @param {Object} data
     */
    patchRollData(data) {
        this.#patchRollData(data);
    }

    #getDerivedAttributes(data) {
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

    #getDefaultedProficiencies(data) {
        const proficiencies = BOTIT.proficiencies;
        const actorProf = data.proficiencies;
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
    #patchRollData(data) {
        // Copy the ability scores to the top level, so that rolls can use
        // formulas like `@str.mod + 4`.
        if (data.skills) {
            for (let [k, v] of Object.entries(data.skills)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }
    }
}