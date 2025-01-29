import {modes} from "./app.js";
import {addMarker, addPath} from "./markerManager.js";
import {currentMap, faergria, kradian, map} from "./mapConfig.js";

export const imageHostUrl = "https://images.zetsuboushii.site"
export const tomeUrl = "https://tome.zetsuboushii.site"

export const CrestIcon = L.Icon.extend({
    options: {
        iconSize: [48, 57.5],
        iconAnchor: [24, 50.5],
        popupAnchor: [1, -42]
    }
})

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