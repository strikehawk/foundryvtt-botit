const locationElementMap = new Map();

function locationMouseEnter(event) {
    const elCircle = event.target;

    if (!elCircle) {
        return;
    }

    console.log(`Mouse entered location '${elCircle.id}'.`);
    const id = elCircle.id;
    const loc = locationsMap.get(id);

    if (!loc) {
        console.error(`Could not find location '${id}'.`);
        return;
    }

    console.log(`Location: ${loc.label}`);
}

function locationMouseLeave(event) {
    const elCircle = event.target;

    if (!elCircle) {
        return;
    }

    console.log(`Mouse left location '${elCircle.id}'.`);
}

function locationClick(event) {
    const elCircle = event.target;

    if (!elCircle) {
        return;
    }

    const id = elCircle.id;    
    const loc = locationsMap.get(id);

    if (!loc) {
        console.error(`Could not find location '${id}'.`);
        return;
    }
    
    setZoneHighlight(loc.zone);
}

function parseLocations() {
    let elCircle;
    let zone;
    let id;
    let zoneId;
    for (const loc of locations) {
        id = loc.id;
        elCircle = document.getElementById(id);

        if (!elCircle) {
            console.warn(`Could not find location circle '${id}'.`);
            continue;
        }

        locationElementMap.set(id, elCircle);
        locationsMap.set(id, loc);
        zoneId = loc.zone;
        
        zone = zonesMap.get(zoneId);
        if (zone) {
            zone.locs.push(id);
        }

        elCircle.setAttribute("class", "location");
        elCircle.addEventListener("mouseenter", locationMouseEnter);
        elCircle.addEventListener("mouseleave", locationMouseLeave);
        elCircle.addEventListener("click", locationClick);
    }
}

function setLocationStyle(id, classes) {
    if (typeof id !== "string") {
        throw new Error("ID must be a string.");
    }

    const circleElement = locationElementMap.get(id);
    if (!circleElement) {
        throw new Error(`Could not find location circle '${id}'.`);
    }

    if (typeof classes === "string") {
        circleElement.setAttribute("class", classes);
    } else {
        circleElement.setAttribute("class", undefined);
    }
}

/**
 * Highlight all locations of the specified zone.
 * @param {string} id The identifier of the zone to highlight.
 */
function setZoneHighlight(id) {
    if (typeof id !== "string") {
        throw new Error("ID must be a string.");
    }

    const zone = zonesMap.get(id);
    if (!zone) {
        throw new Error(`Could not find zone '${id}'.`);
    }

    for (const locId of zone.locs) {
        setLocationStyle(locId, "location wound");
    }
}

parseLocations();