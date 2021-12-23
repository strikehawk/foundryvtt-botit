/**
 * A class responsible of filtering the collection of items of an actor.
 */
export class ItemManagerBase {

    /**
     * The type of Item template managed.
     *
     * @readonly
     * @type {string}
     * @memberof ItemManagerBase
     */
    get type() {
        return this._type;
    }

    /**
     *  True if only one instance of the Item can be present in the manager.
     *
     * @readonly
     * @type {boolean}
     * @memberof ItemManagerBase
     */
    get singleMode() {
        return this._singleMode;
    }

    /**
     * The array of Items matching the manager's type.
     *
     * @readonly
     * @type {Item[]}
     * @memberof ItemManagerBase
     */
    get collection() {
        return this._collection;
    }

    /**
     * A Map to access managed Items by their key. Only defined if `singleMode` = true.
     *
     * @readonly
     * @memberof ItemManagerBase
     */
    get itemsMap() {
        return this._map;
    }

    /**
     * A function retrieving the key of an Item stored in the manager. Only defined if `singleMode` = true.
     *
     * @readonly
     * @type {Function}
     * @memberof ItemManagerBase
     */
    get keyAccessor() {
        return this._keyAccessor;
    }

    constructor(type, singleMode, keyAccessor = (o => o.data.key)) {
        if (typeof type !== "string") {
            throw new Error("Type cannot be empty.");
        }

        this._type = type;
        this._singleMode = singleMode;

        if (singleMode) {
            if (!keyAccessor) {
                throw new Error("Key accessor function cannot be null.");
            }
            this._keyAccessor = keyAccessor;
        }

        this.reset();
    }


    parseItem(item) {
        if (item.type !== this._type) {
            return;
        }

        let key;

        if (this._singleMode) {
            key = this._keyAccessor(item);
            if (this._map.has(key)) {
                console.warn(`Item '${key}' is already present.`);
                return;
            } else {
                this._map.set(key, item);
            }
        }

        this._collection.push(item);

        this._internalParseItem(item, key);
    }

    _internalParseItem(item, key) {}

    finalize() {}

    reset() {
        if (this._singleMode) {
            this._map = new Map();
        }
        this._collection = [];
    }
}