export class ActorArmorDisplayer {
    constructor(actor) {
        this._actor = actor;
    }

    initialize(html) {
        this._displayArmor(html);
    }

    _displayArmor(html) {
        const armorSet = this._actor.system.armorSet;
        if (!armorSet) {
            return;
        }

        for (const loc of armorSet.keys()) {
            html.find(`#${loc}`).addClass("protected");
        }
    }
}