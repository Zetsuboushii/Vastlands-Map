import {currentMap, faergria, kradian, map} from './mapConfig.js'
import {addMarker, localMarkers} from './markerManager.js'
import {pathPoints, showSetPathModal} from "./utils.js";

export let modes = {
    "setMarker": false,
    "deleteMarker": false,
    "setPath": false
}

document.addEventListener("keydown", function (event) {
    if (event.key === "n") {
        modes.setMarker = !modes.setMarker
        modes.deleteMarker = false
        modes.setPath = false
        if (modes.setMarker) {
            console.log('SetMarker mode activated')
        } else {
            console.log('SetMarker mode deactivated')
        }
    } else if (event.key === "d") {
        modes.deleteMarker = !modes.deleteMarker
        modes.setMarker = false
        modes.setPath = false
        if (modes.deleteMarker) {
            console.log('DeleteMarker mode: activated')
        } else {
            console.log('DeleteMarker mode: deactivated')
        }
    } else if (event.key === "p") {
        modes.setPath = !modes.setPath
        modes.setMarker = false
        modes.deleteMarker = false
        if (modes.setPath) {
            console.log('SetPath mode: activated')
            showSetPathModal(localMarkers)
        } else {
            console.log('SetPath mode: deactivated')
        }
    }
})

map.on("click", function (e) {
    if (modes.setMarker) {
        const latlng = e.latlng
        const name = prompt("Enter name of place:")
        if (!name) {
            return
        }
        fetch("https://tome.zetsuboushii.site/api/places.json")
            .then(response => response.json())
            .then(data => {
                const place = data.find(item => item.name.toLowerCase() === name.toLowerCase())
                if (place) {
                    addMarker(currentMap.name, latlng, place)
                } else {
                    alert("Couldn't locate place in API :(")
                }
            })
            .catch(error => console.error("Error while fetching API:", error))
    } else if (modes.setPath) {
        pathPoints.push([e.latlng["lat"], e.latlng["lng"]])
        console.log(pathPoints)
    }
})