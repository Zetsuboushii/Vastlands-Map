import {map, faergria, kradian, currentMap} from './mapConfig.js'
import {CrestIcon, GenericIcon, imageHostUrl, showLocalsJsonModal, tomeUrl, zoomToMarkerByName} from './utils.js'
import {modes} from "./app.js";

export let localMarkers = {"Faergria": [], "Kradian": []}
let activeMarkers = []

export let localPaths = {"Faergria": [], "Kradian": []}
let activePaths = []

function unloadMapElements() {
    activeMarkers.forEach(marker => map.removeLayer(marker))
    activeMarkers = []

    activePaths.forEach(path => map.removeLayer(path))
    activePaths = []
}

export function reloadMapElements() {
    unloadMapElements()

    localMarkers[currentMap.name].forEach(markerData => {
        const marker = L.marker([markerData.y, markerData.x])
            .addTo(map)
            .bindPopup(`<b>${markerData.name}</b><br>${markerData.placeType || "Unknown place"}`)
            .on('mouseover', function (e) {
                this.openPopup()
            })
            .on('mouseout', function (e) {
                this.closePopup()
            })
            .on('click', function (e) {
                if (modes.deleteMarker) {
                    localMarkers[currentMap.name].splice(localMarkers[currentMap.name].indexOf(markerData), 1)
                    reloadMapElements()
                    showLocalsJsonModal(localMarkers)
                } else {
                    window.open(`${tomeUrl}/places/${markerData.name.toLowerCase()}`, '_blank')
                }
            })

        switch (markerData.placeType) {
            case "Hauptstadt":
            case "Stadt":
            case "Dorf":
                marker.setIcon(new CrestIcon({iconUrl: `${imageHostUrl}/dnd/crests/${markerData.name.toLowerCase()}-crest.png`}))
                break
            case "Lager":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_camp.png"}))
                break
            case "Schloss":
            case "Jagdschloss":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_castle.png"}))
                break
            case "Höhle":
            case "Tunnel":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_cave.png"}))
                break
            case "Dock":
            case "Hafen":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_dock.png"}))
                break
            case "Feld":
            case "Farm":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_farm.png"}))
                break
            case "Lichtung":
            case "Grotte":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_grove.png"}))
                break
            case "Mine":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_mine.png"}))
                break
            case "Tor":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_occult.png"}))
                break
            case "Bergpass":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_pass.png"}))
                break
            case "Sumpf":
            case "Moor":
            case "See":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_pond.png"}))
                break
            case "Ruine":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_ruins.png"}))
                break
            case "Hütte":
            case "Siedlung":
            case "Anwesen":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_shack.png"}))
                break
            case "Schiff":
            case "Gewässer":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_ship.png"}))
                break
            case "Schrein":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_shrine.png"}))
                break
            case "Festung":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_stronghold.png"}))
                break
            case "Taverne":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_tavern.png"}))
                break
            case "Tempel":
            case "Kirche":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_temple.png"}))
                break
            case "Grabmal":
            case "Grab":
            case "Gruft":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_tomb.png"}))
                break
            case "Turm":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_tower.png"}))
                break
            case "Windmühle":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_windmill.png"}))
                break
            case "Sägemühle":
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_woodmill.png"}))
                break
            default:
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_poi.png"}))
                break
        }

        activeMarkers.push(marker)
    })

    localPaths[currentMap.name].forEach(pathData => {
        const path = L.polyline(pathData.pathPoints)
            .addTo(map)

        activePaths.push(path)
    })
}

export function loadMapElementsFromFiles() {
    fetch("data/map/markers.json")
        .then(response => response.json())
        .then(markerData => {
            fetch(`${tomeUrl}/api/places.json`)
                .then(response => response.json())
                .then(apiData => {
                    for (const layerName in markerData) {
                        markerData[layerName] = markerData[layerName].map(marker => {
                            const apiPlace = apiData.find(item => item.name === marker.name)
                            if (apiPlace) {
                                marker.placeType = apiPlace.placetype
                            }
                            return marker
                        })
                    }
                    localMarkers = markerData
                    reloadMapElements()
                })
                .catch(error => console.error("Error while fetching place types:", error))
            zoomToMarkerByName(markerData)
        })
        .catch(error => console.error("Error while loading markers:", error))

    fetch("data/map/paths.json")
        .then(response => response.json())
        .then(markerData => {
            localPaths = markerData
            reloadMapElements()
        })
        .catch(error => console.error("Error while loading paths:", error))
}

export function addMarker(latlng, place) {
    const marker = L.marker(latlng)
        .addTo(map)
        .bindPopup(`<b>${place.name}</b><br>${place.placetype || "Unknown place"}`)
    activeMarkers.push(marker)
    localMarkers[currentMap.name].push({name: place.name, x: latlng.lng, y: latlng.lat, placeType: place.placetype})
    showLocalsJsonModal(localMarkers)
    reloadMapElements()
}

export function addPath(pathPoints, start, goal) {
    console.log(pathPoints)
    let arr = []
    arr.push([start.y, start.x])
    pathPoints.forEach(point => arr.push(point))
    arr.push([goal.y, goal.x])

    const path = L.polyline(arr)
        .addTo(map)
    activePaths.push(path)
    localPaths[currentMap.name].push({start: start.name, goal: goal.name, pathPoints: arr})
    showLocalsJsonModal(localPaths)
    reloadMapElements()
}