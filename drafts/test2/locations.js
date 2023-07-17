const locationsMap = new Map();
const zonesMap = new Map();

const zones = [
    {
        "id": "head",
        "label": "Head",
        "locs": []
    },
    {
        "id": "torso",
        "label": "Torso",
        "locs": []
    },
    {
        "id": "arm-left",
        "label": "Arm (left)",
        "locs": []
    },
    {
        "id": "arm-right",
        "label": "Arm (right)",
        "locs": []
    },
    {
        "id": "leg-left",
        "label": "Leg (left)",
        "locs": []
    },
    {
        "id": "leg-right",
        "label": "Leg (right)",
        "locs": []
    },
];

const locations = [
    {
        "id": "1",
        "label": "Head (upper)",
        "zone": "head"
    },
    {
        "id": "2",
        "label": "Head (lower & face)",
        "zone": "head"
    },
    {
        "id": "3",
        "label": "Neck",
        "zone": "head"
    },    
    {
        "id": "4",
        "label": "Chest",
        "zone": "torso"
    },    
    {
        "id": "5",
        "label": "Abdomen",
        "zone": "torso"
    },   
    {
        "id": "6",
        "label": "Groin",
        "zone": "torso"
    },    
    {
        "id": "7l",
        "label": "Hip (left)",
        "zone": "torso"
    }, 
    {
        "id": "7r",
        "label": "Hip (right)",
        "zone": "torso"
    }, 
    {
        "id": "8l",
        "label": "Upper Arm & Shoulder (left)",
        "zone": "arm-left"
    }, 
    {
        "id": "8r",
        "label": "Upper Arm & Shoulder (right)",
        "zone": "arm-right"
    }, 
    {
        "id": "9l",
        "label": "Elbow (left)",
        "zone": "arm-left"
    }, 
    {
        "id": "9r",
        "label": "Elbow (right)",
        "zone": "arm-right"
    }, 
    {
        "id": "10l",
        "label": "Forearm (left)",
        "zone": "arm-left"
    }, 
    {
        "id": "10r",
        "label": "Forearm (right)",
        "zone": "arm-right"
    }, 
    {
        "id": "11l",
        "label": "Hand (left)",
        "zone": "arm-left"
    }, 
    {
        "id": "11r",
        "label": "Hand (right)",
        "zone": "arm-right"
    }, 
    {
        "id": "12l",
        "label": "Thigh (left)",
        "zone": "leg-left"
    }, 
    {
        "id": "12r",
        "label": "Thigh (right)",
        "zone": "leg-right"
    }, 
    {
        "id": "13l",
        "label": "Knee (left)",
        "zone": "leg-left"
    }, 
    {
        "id": "13r",
        "label": "Knee (right)",
        "zone": "leg-right"
    }, 
    {
        "id": "14l",
        "label": "Shin (left)",
        "zone": "leg-left"
    }, 
    {
        "id": "14r",
        "label": "Shin (right)",
        "zone": "leg-right"
    }, 
    {
        "id": "15l",
        "label": "Foot (left)",
        "zone": "leg-left"
    }, 
    {
        "id": "15r",
        "label": "Foot (right)",
        "zone": "leg-right"
    }, 
];

function setupZones() {
    for (const zone of zones) {
        zonesMap.set(zone.id, zone);
    }
}

setupZones();