import sorceryData from "../../data/talents-sorcery.json" assert { type: "json" };
import culturesData from "../../data/talents-culture.json" assert { type: "json" };
import attributesData from "../../data/talents-attributes.json" assert { type: "json" };
import skillsData from "../../data/talents-skills.json" assert { type: "json" };
import proficienciesData from "../../data/talents-skills.json" assert { type: "json" };

import { GenericItem } from "./types.mjs";

export class TalentsConfig {
    /**
     * The sorcery-related available talents.
     *
     * @readonly
     * @type {GenericItem[]}
     * @memberof TalentsConfig
     */
    get sorcery() {
        return this._sorcery;
    }

    /**
     * The culture-related available talents.
     *
     * @readonly
     * @type {GenericItem[]}
     * @memberof TalentsConfig
     */
    get cultures() {
        return this._cultures;
    }

    /**
     * The attribute-related available talents.
     *
     * @readonly
     * @type {GenericItem[]}
     * @memberof TalentsConfig
     */
    get attributes() {
        return this._attributes;
    }

    /**
     * The skill-related available talents.
     *
     * @readonly
     * @type {GenericItem[]}
     * @memberof TalentsConfig
     */
    get skills() {
        return this._skills;
    }

    /**
     * The proficiencies-related available talents.
     *
     * @readonly
     * @type {GenericItem[]}
     * @memberof TalentsConfig
     */
    get proficiencies() {
        return this._proficiencies;
    }

    constructor() {
        this._sorcery = this._loadSorcery();
        this._cultures = this._loadCultures();
        this._attributes = this._loadAttributes();
        this._skills = this._loadSkills();
        this._proficiencies = this._loadProficiencies();
    }

    _loadSorcery() {
        return this._loadItems(sorceryData);
    }

    _loadCultures() {
        return this._loadItems(culturesData);
    }

    _loadAttributes() {
        return this._loadItems(attributesData);
    }

    _loadSkills() {
        return this._loadItems(skillsData);
    }

    _loadProficiencies() {
        return this._loadItems(proficienciesData);
    }

    _loadItems(data) {
        const items = {};

        for (const item of data) {
            items[item.key] = item;
        }

        return items;
    }
}