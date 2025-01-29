import {reloadMapElements, loadMapElementsFromFiles, localMarkers} from './markerManager.js'
import {imageHostUrl, zoomToMarkerByName} from "./utils.js";

export const faergria = {
    name: "Faergria",
    bounds: [[0, 0], [4000, 4000]],
    image: L.imageOverlay(`${imageHostUrl}/dnd/charts/faergria.png`, [[0, 0], [4000, 4000]]),
    minZoom: -2
}
export const kradian = {
    name: "Kradian",
    bounds: [[0, 0], [2000, 1400]],
    image: L.imageOverlay(`${imageHostUrl}/dnd/charts/kradian.jpg`, [[0, 0], [2000, 1400]]),
    minZoom: -1
}
export let currentMap = faergria

let baseMaps = {
    "Faergria": faergria.image,
    "Kradian": kradian.image
}

export let overlays = {
    "Alle": L.layerGroup([]),
    "Städte": L.layerGroup([]),
    "Dörfer": L.layerGroup([]),
    "Sonstiges": L.layerGroup([])
}

export const map = L.map("map", {
    crs: L.CRS.Simple,
    layers: [currentMap.image, overlays.Städte, overlays.Dörfer],
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
    }
    map.setMaxBounds(currentMap.bounds)
    map.fitBounds(currentMap.bounds)
    map.setMinZoom(currentMap.minZoom)
    reloadMapElements()
})

map.fitBounds(currentMap.bounds)
loadMapElementsFromFiles()