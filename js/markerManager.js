import {map, faergria, kradian, currentMap} from './mapConfig.js'
import {CrestIcon, imageHostUrl, showLocalsJsonModal, tomeUrl, zoomToMarkerByName} from './utils.js'

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
                window.open(`${tomeUrl}/places/${markerData.name.toLowerCase()}`, '_blank')
            })

        if (["Hauptstadt", "Stadt", "Dorf"].includes(markerData.placeType)) {
            marker.setIcon(new CrestIcon({iconUrl: `${imageHostUrl}/dnd/crests/${markerData.name.toLowerCase()}-crest.png`}))
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
}