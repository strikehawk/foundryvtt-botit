import { BOTIT } from "../helpers/config.mjs";

export class BodyLocation {
    /**
     * @property The list of armor pieces at the given location.
     * 
     * @type {Item[]}
     * @memberof BodyLocation
     */
    armorPieces;

    /**
     * @property The protection against Piercing damage at the given location.
     *
     * @type {number}
     * @memberof BodyLocation
     */
    piercing;

    /**
     * @property The protection against Blunt damage at the given location.
     *
     * @type {number}
     * @memberof BodyLocation
     */
    blunt;

    /**
     * @property The protection against Cleaving damage at the given location.
     *
     * @type {number}
     * @memberof BodyLocation
     */
    cleaving;

    /**
     * @property An abstraction of the efficiency level at the given location.
     * 
     * @type {number}
     * @memberof BodyLocation
     */
    efficiency;
}

export class ActorArmorManager {
    /**
     * Compute the armor stats of the given actor.
     * 
     * @param {Object} actor 
     * @returns {Map.<string, BodyLocation>}
     */
    static getArmorSet(actor) {
        const armorSet = new Map();

        let armorData;
        let armorPart;
        let armorMaterial;

        /**
         * @type {BodyLocation}
         */
        let bodyLocation;
        for (let i of actor.items) {
            // Append to gear.
            if (i.type !== "armor") {
                continue;
            }

            armorData = i.data.data;

            armorPart = null;
            armorMaterial = null;

            armorPart = BOTIT.armorParts[armorData.part];
            armorMaterial = BOTIT.armorMaterials[armorData.material];

            if (!armorPart) {
                console.error(`Could not find armor part '${armorData.part}'.`);
                continue;
            }

            if (!armorMaterial) {
                console.error(`Could not find armor material '${armorData.material}'.`);
                continue;
            }

            // Iterate over all covered locations to add the armor piece and to possibly update the armor values
            for (const loc of armorPart.zones) {
                bodyLocation = armorSet.get(loc);
                if (!bodyLocation) {
                    bodyLocation = {
                        armorPieces: [],
                        piercing: 0,
                        blunt: 0,
                        cleaving: 0,
                        efficiency: -1
                    };
                    armorSet.set(loc, bodyLocation);
                }

                if (armorMaterial.efficiency > bodyLocation.efficiency) {
                    // New "best" material. Should first armor piece in the array
                    bodyLocation.armorPieces.splice(0, 0, i.data.data);
                    bodyLocation.efficiency = armorMaterial.efficiency;
                    bodyLocation.piercing = armorMaterial.piercing;
                    bodyLocation.blunt = armorMaterial.blunt;
                    bodyLocation.cleaving = armorMaterial.cleaving;
                } else {
                    bodyLocation.armorPieces.push(i.data.data);
                }
            }
        }

        return armorSet;
    }
}