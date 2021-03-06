import { ItemSheetBehaviorBase } from "./item-sheet.behavior.mjs";
import { ItemSheetSkillBehavior } from "./item-sheet-skill.behavior.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class BotitItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    const options = mergeObject(super.defaultOptions, {
      classes: ["botit", "sheet", "item"],
      width: 520,
      height: 500,
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
      // tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });

    return options;
  }

  /**
   * Get the appropriate ItemSheetBehavior based on the Item type.
   * 
   * @param {Object} item 
   */
  static _getBehavior(item) {
    if (!item) {
      return ItemSheetBehaviorBase;
    }

    switch (item.type) {
      case "skill":
        return ItemSheetSkillBehavior;
      default:
        return ItemSheetBehaviorBase;
    }
  }

  /** @inheritdoc */
  get id() {
    const item = this.item;
    let id = `item-${item.id}`;

    return id;
  }

  /** @override */
  get template() {
    return this._behavior.template;
  }

  constructor(item, options) {
    const behaviorClass = BotitItemSheet._getBehavior(item);
    behaviorClass.patchOptions(options);

    super(item, options);
    this._behavior = new behaviorClass(this, item);
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item.data;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = itemData.data;
    context.flags = itemData.flags;

    this._behavior.patchContext(context);

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    this._behavior.activateListeners(html);
  }

  _updateObject(event, formData) {
    this._behavior._updateObject(event, formData);

    super._updateObject(event, formData);
  }

  /** @inheritdoc */
  _onDragStart(event) {
    const li = event.currentTarget;
    if (event.target.classList.contains("entity-link")) return;

    // Create drag data
    const dragData = {
      actorId: this.actor.id,
      sceneId: this.actor.isToken ? canvas.scene?.id : null,
      tokenId: this.actor.isToken ? this.actor.token.id : null
    };

    // Owned Items
    if (li.dataset.itemId) {
      const item = this.actor.items.get(li.dataset.itemId);
      dragData.type = "Item";
      dragData.data = item.data;
    }

    // Active Effect
    if (li.dataset.effectId) {
      const effect = this.actor.effects.get(li.dataset.effectId);
      dragData.type = "ActiveEffect";
      dragData.data = effect.data;
    }

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /** @inheritdoc */
  _onDragOver(event) {
    this._behavior._onDragOver(event);
    super._onDragOver(event);
  }

  /** @inheritdoc */
  _onDrop(event) {
    this._behavior._onDrop(event);
    super._onDrop(event);
  }
}
