import {modes} from "./app.js";
import {addMarker, addPath, localMarkers, localRegions, reloadMapElements} from "./markerManager.js";
import {currentMap, drawnRegions, map} from "./mapConfig.js";

export const imageHostUrl = "https://images.zetsuboushii.site"
export const tomeUrl = "https://tome.zetsuboushii.site"

export function chartToLatLng(x, y) {
    const mapHeight = currentMap.bounds[1][0]; // bounds: [[0,0],[height,width]]
    return {lat: mapHeight - y, lng: x};
}

export function latLngToChart(lat, lng) {
    const mapHeight = currentMap.bounds[1][0];
    return {x: lng, y: mapHeight - lat};
}

export const CrestIcon = L.Icon.extend({
    options: {
        iconSize: [48, 57.5],
        iconAnchor: [24, 29],
        popupAnchor: [0, -29]
    }
})

export const GenericIcon = L.Icon.extend({
    options: {
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25]
    }
})

const placeTypeIcons = {
    "Hauptstadt": `${imageHostUrl}/dnd/crests/{name}-crest.png`,
    "Stadt": `${imageHostUrl}/dnd/crests/{name}-crest.png`,
    "Dorf": `${imageHostUrl}/dnd/crests/{name}-crest.png`,
    "Lager": "assets/markers/marker_camp.png",
    "Schloss": "assets/markers/marker_castle.png",
    "Jagdschloss": "assets/markers/marker_castle.png",
    "Höhle": "assets/markers/marker_cave.png",
    "Tunnel": "assets/markers/marker_cave.png",
    "Dock": "assets/markers/marker_dock.png",
    "Hafen": "assets/markers/marker_dock.png",
    "Feld": "assets/markers/marker_farm.png",
    "Farm": "assets/markers/marker_farm.png",
    "Lichtung": "assets/markers/marker_grove.png",
    "Mine": "assets/markers/marker_mine.png",
    "Tor": "assets/markers/marker_occult.png",
    "Bergpass": "assets/markers/marker_pass.png",
    "Sumpf": "assets/markers/marker_pond.png",
    "Moor": "assets/markers/marker_pond.png",
    "Ruinen": "assets/markers/marker_ruins.png",
    "Ruine": "assets/markers/marker_ruins.png",
    "Hütte": "assets/markers/marker_shack.png",
    "Siedlung": "assets/markers/marker_shack.png",
    "Schiff": "assets/markers/marker_ship.png",
    "Gewässer": "assets/markers/marker_ship.png",
    "Schrein": "assets/markers/marker_shrine.png",
    "Festung": "assets/markers/marker_stronghold.png",
    "Taverne": "assets/markers/marker_tavern.png",
    "Tempel": "assets/markers/marker_temple.png",
    "Kirche": "assets/markers/marker_temple.png",
    "Grabmal": "assets/markers/marker_tomb.png",
    "Grab": "assets/markers/marker_tomb.png",
    "Gruft": "assets/markers/marker_tomb.png",
    "Turm": "assets/markers/marker_tower.png",
    "Windmühle": "assets/markers/marker_windmill.png",
    "Sägemühle": "assets/markers/marker_woodmill.png"
}

export let pathPoints = []

export function showLocalsJsonModal(locals) {
    const jsonString = JSON.stringify(locals, null, 4)

    const modal = document.createElement("div")
    modal.style.position = "fixed"
    modal.style.top = "50%"
    modal.style.left = "50%"
    modal.style.transform = "translate(-50%, -50%)"
    modal.style.backgroundColor = "white"
    modal.style.padding = "20px"
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
    modal.style.zIndex = "1000"
    modal.style.width = "80%"
    modal.style.maxWidth = "600px"
    modal.style.borderRadius = "8px"

    const textArea = document.createElement("textarea")
    textArea.value = jsonString
    textArea.style.width = "100%"
    textArea.style.height = "200px"
    textArea.style.marginBottom = "10px"
    textArea.readOnly = true

    const copyButton = document.createElement("button")
    copyButton.textContent = "Copy JSON"
    copyButton.style.display = "inline-block"
    copyButton.style.marginRight = "10px"
    copyButton.onclick = () => {
        textArea.select()
        document.execCommand("copy")
    }

    const closeButton = document.createElement("button")
    closeButton.textContent = "Close"
    closeButton.style.display = "inline-block"
    closeButton.onclick = () => {
        document.body.removeChild(modal)
    }

    modal.appendChild(textArea)
    modal.appendChild(copyButton)
    modal.appendChild(closeButton)
    document.body.appendChild(modal)
}

export function showSetPathModal(localMarkers) {
    const modal = document.createElement("div")
    modal.style.position = "fixed"
    modal.style.top = "50%"
    modal.style.left = "50%"
    modal.style.transform = "translate(-50%, -50%)"
    modal.style.backgroundColor = "white"
    modal.style.padding = "20px"
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
    modal.style.zIndex = "1000"
    modal.style.width = "80%"
    modal.style.maxWidth = "600px"
    modal.style.borderRadius = "8px"

    const title = document.createElement("h3")
    title.textContent = "Select Start and Destination Markers"

    const startSelect = document.createElement("select")
    const destinationSelect = document.createElement("select")

    Object.keys(localMarkers).forEach(layerName => {
        localMarkers[layerName].forEach(marker => {
            const option1 = document.createElement("option")
            option1.value = marker.name
            option1.textContent = marker.name
            startSelect.appendChild(option1)

            const option2 = document.createElement("option")
            option2.value = marker.name
            option2.textContent = marker.name
            destinationSelect.appendChild(option2)
        })
    })

    const confirmButton = document.createElement("button")
    confirmButton.textContent = "Confirm Selection"
    confirmButton.style.display = "block"
    confirmButton.style.marginTop = "10px"
    confirmButton.onclick = () => {
        const startMarker = localMarkers[currentMap.name].find((e) => e.name === startSelect.value)
        const destinationMarker = localMarkers[currentMap.name].find((e) => e.name === destinationSelect.value)
        if (startMarker === destinationMarker) {
            alert("Start and destination cannot be the same!")
            return
        }
        addPath(pathPoints, startMarker, destinationMarker)
    }

    const closeButton = document.createElement("button")
    closeButton.textContent = "Close"
    closeButton.style.display = "block"
    closeButton.style.marginTop = "10px"
    closeButton.onclick = () => {
        pathPoints = []
        modes.setPath = false
        console.log('SetPath mode: deactivated')
        document.body.removeChild(modal)
    }

    modal.appendChild(title)
    modal.appendChild(document.createTextNode("Start: "))
    modal.appendChild(startSelect)
    modal.appendChild(document.createElement("br"))
    modal.appendChild(document.createTextNode("Destination: "))
    modal.appendChild(destinationSelect)
    modal.appendChild(document.createElement("br"))
    modal.appendChild(confirmButton)
    modal.appendChild(closeButton)
    document.body.appendChild(modal)
}

export function showGeoJsonModal() {
    const geojsonData = drawnRegions.toGeoJSON();
    const jsonString = JSON.stringify(geojsonData, null, 4);

    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.zIndex = "1000";
    modal.style.width = "80%";
    modal.style.maxWidth = "600px";
    modal.style.borderRadius = "8px";

    const textArea = document.createElement("textarea");
    textArea.value = jsonString;
    textArea.style.width = "100%";
    textArea.style.height = "300px";
    textArea.style.marginBottom = "10px";
    textArea.readOnly = true;

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy JSON";
    copyButton.style.marginRight = "10px";
    copyButton.onclick = () => {
        textArea.select();
        document.execCommand("copy");
    };

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.onclick = () => {
        document.body.removeChild(modal);
    };

    modal.appendChild(textArea);
    modal.appendChild(copyButton);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
}

export function zoomToMarkerByName(markerData) {
    let params = new URLSearchParams(window.location.search)

    if (params.get("marker")) {
        markerData[currentMap.name].forEach(marker => {
            if (marker.name === params.get("marker")) {
                map.setView([marker.y, marker.x], 1.5)
                return 0
            }
        })

        localRegions.features.forEach(region => {
            if (params.get("marker") === region.properties.name) {
                const coordinates = region.geometry.coordinates[0];

                let sumLat = 0, sumLng = 0;
                coordinates.forEach(coord => {
                    sumLng += coord[0];
                    sumLat += coord[1];
                });

                const centerLng = sumLng / coordinates.length;
                const centerLat = sumLat / coordinates.length;

                map.setView([centerLat, centerLng], 1.5);
            }
        })
    }
}