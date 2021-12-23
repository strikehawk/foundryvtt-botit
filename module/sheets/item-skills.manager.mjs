import { ItemManagerBase } from "./item.manager.base.mjs";

export class ItemSkillsManager extends ItemManagerBase {
    constructor(context) {
        super("skill", true);

        this._context = context;

        // Get skill values
        this._skillValues = new Map();

        if (context.data.skills) {
            for (const [k, v] of Object.entries(context.data.skills)) {
                this._skillValues.set(k, v);
            }
        }
    }

    _internalParseItem(item, key) {
        item.value = 0;

        // Read current skill value
        if (this._skillValues.has(key)) {
            item.value = this._skillValues.get(key);
        }
    }

    finalize() {
        // Sort the collection
        this._collection = this._collection.sort((a, b) => {
            return this._keyAccessor(a).localeCompare(this._keyAccessor(b));
        });
    }
}