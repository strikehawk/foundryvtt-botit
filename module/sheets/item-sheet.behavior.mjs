import { BOTIT } from "../helpers/config.mjs";
import { BotitItem } from "../documents/item.mjs";

export class ItemSheetBehaviorBase {
    
    static patchOptions(options) {

    }

    /**
     * The sheet this behavior is attached to.
     * @type {BotitItemSheet} 
     *
     * @readonly
     * @memberof ItemSheetBehaviorBase
     */
    get sheet() {
        return this._sheet;
    }

    /**
     * The item displayed in the sheet.
     * @type {BotitItem}
     *
     * @readonly
     * @memberof ItemSheetBehaviorBase
     */
    get item() {
        return this._item;
    }

    /**
     * The path to the template of the item sheet.
     * @type {string}
     *
     * @readonly
     * @memberof ItemSheetBehaviorBase
     */
    get template() {
        const path = `systems/${BOTIT.systemFolder}/templates/item`;
        return `${path}/item-sheet.html`;
    }

    constructor(sheet, item) {
        this._sheet = sheet;
        this._item = item;
    }

    activateListeners(html) {
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        // Roll handlers, click handlers, etc. would go here.
    }

    patchContext(context) {
        
    }

    _updateObject(event, formData) {
    }

    /** @inheritdoc */
    _onDragOver(event) {
    }

    /** @inheritdoc */
    _onDrop(event) {
    }
}