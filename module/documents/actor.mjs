/** @typedef {import("@league-of-foundry-developers/foundry-vtt-types")} */

import { ActorBehaviorSelector } from "./actor-behavior-selector.mjs";
import { ActorBehaviorBase } from "./actor.behavior.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class BotitActor extends Actor {

  /** 
   * @type {ActorBehaviorBase} 
   * @private
   */
  _behavior = undefined;

  /** @override */
  prepareData() {
    this._behavior = ActorBehaviorSelector.getBehavior(this);

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

    this._behavior?.prepareEmbeddedDocuments(this);
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
    this._behavior?.prepareDerivedData(this);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareHeroData(actorData) {
    if (this.type !== 'hero') return;

    // Make modifications to data here. For example:
    const data = actorData;

    // this._setFakeData(data);
    this._getDerivedAttributes(data);
    this._getDefaultedProficiencies(data);
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    if (this._behavior && this._behavior.patchRollData) {
      this._behavior.patchRollData(data);
    }

    return data;
  }
}