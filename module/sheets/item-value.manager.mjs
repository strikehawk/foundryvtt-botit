import { ItemManagerBase } from "./item.manager.base.mjs";

export class ItemValueManager extends ItemManagerBase {
    constructor(type, currentValues, context) {
        super(type, true);

        this._context = context;

        // Get current values
        this._currentValues = new Map();

        if (currentValues) {
            for (const [k, v] of Object.entries(currentValues)) {
                this._currentValues.set(k, v);
            }
        }
    }

    _internalParseItem(item, key) {
        item.value = 0;

        // Read current value
        if (this._currentValues.has(key)) {
            item.value = this._currentValues.get(key);
        }
    }

    finalize() {
        // Sort the collection
        this._collection = this._collection.sort((a, b) => {
            return this._keyAccessor(a).localeCompare(this._keyAccessor(b));
        });
    }
}