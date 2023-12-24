import { BOTIT } from "../helpers/config.mjs";
import { ItemManagerBase } from "./item.manager.base.mjs";
import { ItemValueManager } from "./item-value.manager.mjs";
import { ActorProficienciesManager } from "./actor-proficiencies.manager.mjs";
import { ActorArmorDisplayer } from "./actor-armor.displayer.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BotitActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["botit", "sheet", "actor"],
      template: `systems/${BOTIT.systemFolder}/templates/actor/actor-hero-sheet.html`,
      width: 800,
      height: 650,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
    });
  }

  /** @override */
  get template() {
    return `systems/${BOTIT.systemFolder}/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  /** @type {ItemManagerBase[]} */
  _itemManagers;

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = context.actor.system;
    context.flags =  context.actor.flags;

    // Prepare Hero data and items.
    if (context.actor.type == 'hero') {
      this._itemManagers = this._getItemManagers(context);

      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // // Prepare active effects
    // context.effects = prepareActiveEffectCategories(this.actor.effects);

    this._armorManager = new ActorArmorDisplayer(context.actor);

    return context;
  }

  _getItemManagers(context) {
    this._skillsManager = new ItemValueManager("skill", context.data.skills, context);
    // this._proficienciesManager = new ItemValueManager("proficiency", context.data.proficiencies, context);

    return [
      this._skillsManager,
      // this._proficienciesManager
    ];
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;

      for (const mgr of this._itemManagers) {
        mgr.parseItem(i);
      }

      // Append to gear.
      if (i.type === "item") {
        gear.push(i);
      }
    }

    for (const mgr of this._itemManagers) {
      mgr.finalize();
    }

    // Assign and return
    context.gear = gear;
    context.skills = this._skillsManager.collection;

    // context.proficiencies = this._proficienciesManager.collection;
    context.proficiencies = ActorProficienciesManager.getCollection(context);
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    if (this._armorManager) {
      this._armorManager.initialize(html);
    }

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.profile-remove').click(ev => {
      const index = $(ev.currentTarget).data("index");
      const item = this.actor.items.get(index);
      item.delete();

      this.render(false);
    });

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget);
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();

      this.render(false);
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.owner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[Skill] ${dataset.label}` : '';
      let roll = await new Roll(dataset.roll, this.actor.getRollData()).evaluate({ async: true });
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  async _updateObject(event, formData) {
    // Remove proficiencies if value equals to defaulted one
    const defaultedProficiencies = this.actor.system.defaultedProficiencies;

    let key;
    let formValue;
    let defaultedValue;
    for (const prof of Object.values(BOTIT.proficiencies)) {
      key = `data.proficiencies.${prof.key}`;
      formValue = formData[key];

      if (formValue === 0) {
        // Remove
        delete formData[key];

        continue;
      }

      defaultedValue = defaultedProficiencies[prof.key] || 0;
      if (formValue === defaultedValue) {
        // Remove
        delete formData[key];
        continue;
      }
    }

    super._updateObject(event, formData);
  }
}
