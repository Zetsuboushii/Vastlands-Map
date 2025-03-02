import { map, faergria, kradian, currentMap, overlays, drawnRegions } from './mapConfig.js'
import { CrestIcon, GenericIcon, imageHostUrl, showLocalsJsonModal, tomeUrl, zoomToMarkerByName } from './utils.js'
import { modes } from "./app.js";

export let localMarkers = {"Faergria": [], "Kradian": [], "Markath": [], "Kouyoukuni": []}
let activeMarkers = []

export let localPaths = {"Faergria": [], "Kradian": [], "Markath": [], "Kouyoukuni": []}
let activePaths = []

export let localRegions = {}

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
                    window.open(`${tomeUrl}/places/${markerData.name.toLowerCase().replace(" ", "-")}`, '_blank')
                }
            })

        switch (markerData.placeType) {
            case "Hauptstadt":
            case "Stadt":
            case "Dorf":
                marker.addTo(overlays.Ortschaften)
                marker.setIcon(new CrestIcon({iconUrl: `${imageHostUrl}/dnd/crests/${markerData.name.toLowerCase()}-crest.png`}))
                break
            case "Lager":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_camp.png"}))
                break
            case "Schloss":
            case "Jagdschloss":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_castle.png"}))
                break
            case "Höhle":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_cave.png"}))
                break
            case "Tunnel":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_cave.png"}))
                break
            case "Dock":
            case "Hafen":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_dock.png"}))
                break
            case "Feld":
            case "Farm":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_farm.png"}))
                break
            case "Lichtung":
            case "Hain":
            case "Grotte":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_grove.png"}))
                break
            case "Mine":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_mine.png"}))
                break
            case "Tor":
                marker.addTo(overlays.Tore)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_occult.png"}))
                break
            case "Bergpass":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_pass.png"}))
                break
            case "Sumpf":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_pond.png"}))
                break
            case "Moor":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_pond.png"}))
                break
            case "See":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_pond.png"}))
                break
            case "Ruinen":
            case "Ruine":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_ruins.png"}))
                break
            case "Hütte":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_shack.png"}))
                break
            case "Siedlung":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_shack.png"}))
                break
            case "Anwesen":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_shack.png"}))
                break
            case "Gewässer":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_ship.png"}))
                break
            case "Schrein":
                marker.addTo(overlays.Schreine)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_shrine.png"}))
                break
            case "Verlies":
            case "Festung":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_stronghold.png"}))
                break
            case "Taverne":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_tavern.png"}))
                break
            case "Kloster":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_tavern.png"}))
                break
            case "Tempel":
                marker.addTo(overlays.Tempel)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_temple.png"}))
                break
            case "Kirche":
                marker.addTo(overlays.Tempel)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_temple.png"}))
                break
            case "Grabmal":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_tomb.png"}))
                break
            case "Grab":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_tomb.png"}))
                break
            case "Gruft":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_tomb.png"}))
                break
            case "Turm":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_tower.png"}))
                break
            case "Windmühle":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_windmill.png"}))
                break
            case "Sägemühle":
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_woodmill.png"}))
                break
            default:
                marker.addTo(overlays.Sonstiges)
                marker.setIcon(new GenericIcon({iconUrl: "assets/markers/marker_poi.png"}))
                break
        }
        activeMarkers.push(marker)
    })

    localPaths[currentMap.name].forEach(pathData => {
        const path = L.polyline(pathData.pathPoints, {
            dashArray: "40 20",
            color: "#8f242b",
            weight: 5
        })
            .addTo(overlays.Routen)
        activePaths.push(path)
    })

    fetch("data/map/" + currentMap.name.toLowerCase() + ".geojson")
        .then(response => response.json())
        .then(geojsonData => {
            drawnRegions.clearLayers();
            L.geoJSON(geojsonData, {
                style: function(feature) {
                    let regionColor = "#434449"
                    switch (feature.properties.region) {
                        case "Farodris":
                            regionColor = "#4392dc"
                            break
                        case "Tinorland":
                            regionColor = "#56bd42"
                            break
                        case "Hal":
                            regionColor = "#9f1fb3"
                            break
                        case "Adrestia":
                            regionColor = "#ee2828"
                            break
                        case "Thaugrien":
                            regionColor = "#6a17e3"
                            break
                        case "Inidal":
                            regionColor = "#a8622c"
                            break
                        case "Kluirm":
                            regionColor = "#ffe43c"
                            break
                        case "Escrigria":
                            regionColor = "#ffffff"
                            break
                    }

                    return {
                        color: regionColor,
                        weight: 4,
                        fillOpacity: 0.1,
                        opacity: 0.5,
                        lineJoin: "round"
                    }
                },
                onEachFeature: function(feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        layer.bindTooltip(feature.properties.name, {permanent: true, direction:"center"})
                    }
                }
            }).addTo(drawnRegions);

            localRegions = geojsonData
        })
        .catch(error => console.error("Error while loading regions:", error))
}

export function loadMapElementsFromFiles() {
    fetch("data/map/markers.json")
        .then(response => response.json())
        .then(markerData => {
            fetch(`${tomeUrl}/static/json/places.json`)
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
        .then(pathData => {
            localPaths = pathData
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