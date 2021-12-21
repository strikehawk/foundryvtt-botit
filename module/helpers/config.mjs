import { BotitSettings } from "./botit-settings.mjs";

/**
 * An object containing static data for the game system.
 * @type {BotitSettings}
 */
export const BOTIT = {};

/**
 * The name of the folder containing the system.
 * @type {string}
 */
BOTIT.systemFolder = "blade-iron-throne";

/**
 * The set of Skills used within the system, and their translation key.
 * @type {Object}
 */
BOTIT.skills = {
  "acrobatie": "BOTIT.Skills.acrobatie",
  "athletisme": "BOTIT.Skills.athletisme",
  "autorite": "BOTIT.Skills.autorite",
  "combat-cac": "BOTIT.Skills.combat-cac",
  "combat-distance": "BOTIT.Skills.combat-distance",
  "connaissance": "BOTIT.Skills.connaissance",
  "defense": "BOTIT.Skills.defense",
  "discretion": "BOTIT.Skills.discretion",
  "documentation": "BOTIT.Skills.documentation",
  "eloquence": "BOTIT.Skills.eloquence",
  "equitation": "BOTIT.Skills.equitation",
  "intellect": "BOTIT.Skills.intellect",
  "langue": "BOTIT.Skills.langue",
  "muscles": "BOTIT.Skills.muscles",
  "pilotage": "BOTIT.Skills.pilotage",
  "perception": "BOTIT.Skills.perception",
  "psychologie": "BOTIT.Skills.psychologie",
  "reflexes": "BOTIT.Skills.reflexes",
  "resistance": "BOTIT.Skills.resistance",
  "soins": "BOTIT.Skills.soins",
  "survie": "BOTIT.Skills.survie",
  "technique": "BOTIT.Skills.technique",
  "volonte": "BOTIT.Skills.volonte"
};

BOTIT.valueTypes = {
  NUMERICAL: "numerical",
  ROLL_EXPRESSION: "roll-expression",
}

const systemValues = [
  { id: "resources.hp.max", label: "Points de Vitalité (max)" },
  { id: "resources.wounds.max", label: "Blessures (max)" },
  { id: "damageBonus.melee", label: "Bonus aux Dégâts (Corps à corps)", type: BOTIT.valueTypes.ROLL_EXPRESSION },
  { id: "damageBonus.ranged", label: "Bonus aux Dégâts (Distance)", type: BOTIT.valueTypes.ROLL_EXPRESSION },
  { id: "skills.acrobatie", label: "Acrobatie" },
  { id: "skills.athletisme", label: "Athlétisme" },
  { id: "skills.autorite", label: "Autorité" },
  { id: "skills.combat-cac", label: "Combat (Corps à corps)" },
  { id: "skills.combat-distance", label: "Combat (Distance)" },
  { id: "skills.connaissance", label: "Connaissance" },
  { id: "skills.defense", label: "Défense" },
  { id: "skills.discretion", label: "Discrétion" },
  { id: "skills.documentation", label: "Documentation" },
  { id: "skills.eloquence", label: "Eloquence" },
  { id: "skills.equitation", label: "Equitation" },
  { id: "skills.intellect", label: "Intellect" },
  { id: "skills.langue", label: "Langue" },
  { id: "skills.muscles", label: "Muscles" },
  { id: "skills.perception", label: "Perception" },
  { id: "skills.pilotage", label: "Pilotage" },
  { id: "skills.psychologie", label: "Psychologie" },
  { id: "skills.reflexes", label: "Réflexes" },
  { id: "skills.resistance", label: "Résistance" },
  { id: "skills.soins", label: "Soins" },
  { id: "skills.survie", label: "Survie" },
  { id: "skills.technique", label: "Technique" },
  { id: "skills.volonte", label: "Volonté" },
];

BOTIT.values = new Map();
for (const v of systemValues) {
  BOTIT.values.set(v.id, v);
}