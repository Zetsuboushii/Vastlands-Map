import {map, drawnRegions} from './mapConfig.js'
import {addMarker, localMarkers} from './markerManager.js'
import {pathPoints, showGeoJsonModal, showSetPathModal, tomeUrl} from "./utils.js";

export let modes = {
    "setMarker": false,
    "deleteMarker": false,
    "setPath": false,
    "editRegion": false
}

let drawControl;

document.addEventListener("keydown", function (event) {
    if (event.key === "n") {
        modes.setMarker = !modes.setMarker
        modes.deleteMarker = false
        modes.setPath = false
        modes.editRegion = false
        if (drawControl) {
            map.removeControl(drawControl);
        }
        console.log(modes.setMarker ? 'SetMarker mode activated' : 'SetMarker mode deactivated')
    } else if (event.key === "d") {
        modes.deleteMarker = !modes.deleteMarker
        modes.setMarker = false
        modes.setPath = false
        modes.editRegion = false
        if (drawControl) {
            map.removeControl(drawControl);
        }
        console.log(modes.deleteMarker ? 'DeleteMarker mode: activated' : 'DeleteMarker mode: deactivated')
    } else if (event.key === "p") {
        modes.setPath = !modes.setPath
        modes.setMarker = false
        modes.deleteMarker = false
        modes.editRegion = false
        if (drawControl) {
            map.removeControl(drawControl);
        }
        if (modes.setPath) {
            console.log('SetPath mode: activated')
            showSetPathModal(localMarkers)
        } else {
            console.log('SetPath mode: deactivated')
        }
    } else if (event.key === "r") {
        modes.editRegion = !modes.editRegion
        modes.setMarker = false
        modes.deleteMarker = false
        modes.setPath = false
        if (modes.editRegion) {
            drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: drawnRegions,
                    edit: true,
                    remove: true
                },
                draw: {
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                        shapeOptions: {
                            color: '#3388ff'
                        }
                    },
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    marker: false,
                    circlemarker: false
                }
            });
            map.addControl(drawControl);
            console.log('Region editing mode activated')
        } else {
            map.removeControl(drawControl);
            console.log('Region editing mode deactivated')
        }
    } else if (event.key === "g") {
        showGeoJsonModal();
    }
})

map.on("click", function (e) {
    if (modes.setMarker) {
        const latlng = e.latlng
        const name = prompt("Enter name of place:")
        if (!name) {
            return
        }
        fetch(`${tomeUrl}/static/json/places.json`)
            .then(response => response.json())
            .then(data => {
                if (data.find(item => item.name.toLowerCase() === name.toLowerCase())) {
                    addMarker(latlng, data.find(item => item.name.toLowerCase() === name.toLowerCase()))
                } else {
                    addMarker(latlng, {"name": name, "placetype": prompt("Enter place type:")})
                }
            })
            .catch(error => console.error("Error while fetching API:", error))
    } else if (modes.setPath) {
        pathPoints.push([e.latlng["lat"], e.latlng["lng"]])
        console.log(pathPoints)
    } else if (modes.deleteMarker) {

    }
})
