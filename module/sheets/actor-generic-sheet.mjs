import { BOTIT } from "../helpers/config.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BotitGenericActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["botit", "sheet", "actor"],
      template: `systems/${BOTIT.systemFolder}/templates/actor/actor-generic-sheet.html`,
      width: 800,
      height: 650,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/${BOTIT.systemFolder}/templates/actor/actor-generic-sheet.html`;
  }
}