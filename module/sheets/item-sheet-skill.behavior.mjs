import { BOTIT } from "../helpers/config.mjs";

import { ItemSheetBehaviorBase } from "./item-sheet.behavior.mjs";

export class ItemSheetSkillBehavior extends ItemSheetBehaviorBase {

    static patchOptions(options) {
        options.width = 600;
        options.height = 400;
    }

    get template() {
        return `systems/${BOTIT.systemFolder}/templates/item/item-skill-sheet.html`;
    }

    constructor(sheet, item) {
        super(sheet, item);
    }
}