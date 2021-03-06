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
    return `systems/${BOTIT.systemFolder}/templates/actor/actor-${this.actor.data.type}-sheet.html`;
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

    // Use a safe clone of the actor data for further operations.
    const actorData = context.actor.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = actorData.data;
    context.flags = actorData.flags;

    // Prepare Hero data and items.
    if (actorData.type == 'hero') {
      this._itemManagers = this._getItemManagers(context);

      this._prepareItems(context);
      this._prepareCharacterData(context);
      this._computeModifiers(context);
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

  /**
   * Parse & prepare Character data.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    return;

    context.data.viewMode = true;

    if (!context.archetype) {
      return;
    }

    const archetype = context.archetype;

    const modifiableValues = new Map();

    // Handle resources.
    context.data.resources.hp.max.baseValue = archetype.data.resources.hp;
    modifiableValues.set("resources.hp.max", context.data.resources.hp.max);
    context.data.resources.wounds.max.baseValue = archetype.data.resources.wounds;
    modifiableValues.set("resources.wounds.max", context.data.resources.wounds.max);

    // Handle damage bonus
    context.data.damageBonus.melee.baseValue = archetype.data.damageBonus.melee;
    modifiableValues.set("damageBonus.melee", context.data.damageBonus.melee);
    context.data.damageBonus.ranged.baseValue = archetype.data.damageBonus.ranged;
    modifiableValues.set("damageBonus.ranged", context.data.damageBonus.ranged);

    // Handle talents
    if (!context.data.talents) {
      context.data.talents = foundry.utils.deepClone(archetype.data.talents);
    }
    const currentTalents = context.data.talents;
    Object.assign(currentTalents[0], archetype.data.talents[0]);
    Object.assign(currentTalents[1], archetype.data.talents[1]);

    // Handle skills.
    const currentSkills = context.data.skills;
    const newSkills = {};

    let skill;
    let currentSkill;
    let skillId;
    for (let [k, v] of Object.entries(archetype.data.skills)) {
      currentSkill = currentSkills[k] ? foundry.utils.deepClone(currentSkills[k]) : {};

      skillId = `skills.${k}`;

      skill = foundry.utils.deepClone(v);
      skill.id = skillId;
      skill.label = game.i18n.localize(BOTIT.skills[k]) ?? k;
      skill.uuid = getSkillIdentifier(k, skill);

      skill = Object.assign(currentSkill, skill);
      newSkills[k] = skill;

      modifiableValues.set(skillId, skill);
    }

    context.data.skills = newSkills;

    // Apply Profile modifiers
    this._applyProfile(context, modifiableValues)
  }

  _applyProfile(context, modifiableValues) {
    if (context.profile) {
      let modifiableValue;

      const boostedSkills = new Set(context.profile.data.boostedSkills);

      // Handle skills.
      let skillModifier;
      let valueId;
      let bonus;

      for (let [k, v] of Object.entries(context.data.skills)) {
        skillModifier = boostedSkills.has(k) ? context.profile.data.boostedSkillBonus : context.profile.data.generalSkillBonus;
        valueId = `skills.${k}`;
        modifiableValue = modifiableValues.get(valueId);
        modifiableValue.modifiers = [];

        bonus = { valueId, modifier: skillModifier };
        modifiableValue.modifiers.push(bonus);
      }

      for (const feature of Object.values(context.profile.data.features)) {
        if (Array.isArray(feature.bonus)) {
          for (const bonus of feature.bonus) {
            if (!bonus.valueId) {
              console.error(`No valueId for bonus`);
              continue;
            }

            // Get the value
            modifiableValue = modifiableValues.get(bonus.valueId);
            modifiableValue.modifiers = [];

            modifiableValue.modifiers.push(bonus);
          }
        }
      }
    }
  }

  _computeModifiers(context) {
    return;

    // Handle resources.
    this._processModifiableValue(context.data.resources.hp.max);
    this._processModifiableValue(context.data.resources.wounds.max);

    // Handle damage bonus.
    this._processModifiableValue(context.data.damageBonus.melee);
    this._processModifiableValue(context.data.damageBonus.ranged);

    // Handle skills.
    for (let [k, v] of Object.entries(context.data.skills)) {
      this._processModifiableValue(v);
    }
  }

  _processModifiableValue(v) {
    let sumModifiers;

    // Get the system value definition
    let systemValue = BOTIT.values.get(v.id);
    if (!systemValue) {
      console.error(v);
    }

    const valueType = systemValue.type === BOTIT.valueTypes.ROLL_EXPRESSION ? BOTIT.valueTypes.ROLL_EXPRESSION : BOTIT.valueTypes.NUMERICAL;

    // Compute sum of modifiers
    sumModifiers = valueType === BOTIT.valueTypes.ROLL_EXPRESSION ? "" : 0;
    if (v.modifiers) {
      for (const mod of v.modifiers) {
        sumModifiers += mod.modifier;
      }
    } else {
      v.modifiers = [];
    }
    v.modifier = sumModifiers;

    // Calculate the final value
    const baseValue = valueType === BOTIT.valueTypes.ROLL_EXPRESSION ? v.baseValue.toString() : v.baseValue;
    v.value = baseValue + v.modifier;
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
    const defaultedProficiencies = this.actor.data.data.defaultedProficiencies;

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
