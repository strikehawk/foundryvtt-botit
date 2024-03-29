import { BOTIT } from "../helpers/config.mjs";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class BotitItem extends Item {
  constructor(data, context) {
    super(data, context);

    setEntityImage(data);
  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    // If present, return the actor's roll data.
    if (!this.actor) return null;
    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.data.data);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this.data;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.data.data.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.data.description ?? ''
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.item.formula, rollData).roll();
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}

const DEFAULT_ITEM_IMAGE = "icons/svg/item-bag.svg";

function getDefaultItemImagePath(itemData) {
  let url;

  switch (itemData.type) {
    case "talent":
      url = `systems/${BOTIT.systemFolder}/assets/svg/talent.svg`;
      break;
    default:
      url = "icons/svg/item-bag.svg";
  }

  return url;
}

function setEntityImage(entityData) {
  let url = getDefaultItemImagePath(entityData);

  const prevImg = entityData.img;
  entityData.img = !prevImg || prevImg === DEFAULT_ITEM_IMAGE ? url : prevImg;
}
