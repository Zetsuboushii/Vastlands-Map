import {reloadMapElements, loadMapElementsFromFiles, localMarkers} from './markerManager.js'
import {imageHostUrl, zoomToMarkerByName} from "./utils.js";

export const faergria = {
    name: "Faergria",
    bounds: [[0, 0], [4000, 4000]],
    image: L.imageOverlay(`${imageHostUrl}/dnd/charts/faergria.png`, [[0, 0], [4000, 4000]]),
    minZoom: -2
}
export const markath = {
    name: "Markath",
    bounds: [[0, 0], [1600, 1800]],
    image: L.imageOverlay(`${imageHostUrl}/dnd/charts/markath.png`, [[0, 0], [1600, 1800]]),
    minZoom: -1
}
export const kradian = {
    name: "Kradian",
    bounds: [[0, 0], [4000, 2800]],
    image: L.imageOverlay(`${imageHostUrl}/dnd/charts/kradian.png`, [[0, 0], [4000, 2800]]),
    minZoom: -2
}
export const kouyoukuni = {
    name: "Kouyoukuni",
    bounds: [[0, 0], [4000, 4000]],
    image: L.imageOverlay(`${imageHostUrl}/dnd/charts/kouyoukuni.png`, [[0, 0], [4000, 4000]]),
    minZoom: -2
}
export let currentMap = faergria

export let baseMaps = {
    "Faergria": faergria.image,
    "Markath": markath.image,
    "Kradian": kradian.image,
    "Kouyoukuni": kouyoukuni.image
}

export let overlays = {
    "Wege": L.layerGroup([]),
    "Ortschaften": L.layerGroup([]),
    "Tore": L.layerGroup([]),
    "Sonstiges": L.layerGroup([])
}

export const map = L.map("map", {
    crs: L.CRS.Simple,
    layers: [currentMap.image, overlays.Wege, overlays.Ortschaften, overlays.Tore, overlays.Sonstiges],
    maxBounds: faergria.bounds,
    maxBoundsViscosity: 1.0,
    minZoom: faergria.minZoom,
    maxZoom: 1.5,
    attributionControl: false
})

export let layerControl = L.control.layers(baseMaps, overlays).addTo(map)

map.on("baselayerchange", function (e) {
    switch (e.layer) {
        case faergria.image:
            currentMap = faergria
            break
        case kradian.image:
            currentMap = kradian
            break
        case markath.image:
            currentMap = markath
            break
        case kouyoukuni.image:
            currentMap = kouyoukuni
            break
    }
    map.setMaxBounds(currentMap.bounds)
    map.fitBounds(currentMap.bounds)
    map.setMinZoom(currentMap.minZoom)

    Object.values(overlays).forEach(layer => layer.clearLayers())

    reloadMapElements()
})

map.fitBounds(currentMap.bounds)
loadMapElementsFromFiles()