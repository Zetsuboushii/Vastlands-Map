function run(element) {
    const input = window.input.value;

    let data = JSON.parse(input);
    let otherCoords = data.features.map((d) => d.geometry.coordinates).flat(2);

    for (let i = 0; i < data.features.length; i++) {
        const feature = data.features[i];
        const name = feature.properties.region + " > " + feature.properties.name
        //console.log(name);

        // For each coord check each other coord and collapse if necessary
        for (let j = 0; j < feature.geometry.coordinates.length; j++) {
            const areaCoords = feature.geometry.coordinates[j];

            for (let k = 0; k < areaCoords.length; k++) {
                const coord = areaCoords[k];

                // delete point
                deletePoint = [
                    2169.757158,
                    1534.421715
                ]
                if (calculateDistance(coord,deletePoint) < 1) {
                    window.deleteRegion.innerHTML = name
                    window.knecht.innerHTML = `window.outputData.features[${i}].geometry.coordinates[${j}].splice(${k},1); window.writeToOutput()`
                    continue
                }

                for (let l = 0; l < otherCoords.length; l++) {
                    const otherCoord = otherCoords[l];
                    let midpoint = calculateMidpoint(coord, otherCoord);
                    if (midpoint) {
                        //console.log(`made a midpoint: ${coord} x ${otherCoord} = ${midpoint}`);
                        areaCoords[k] = midpoint; // Update the coord with the midpoint
                        break; // Exit the innermost loop
                    }
                }
            }
        }
    }

    window.output.value = JSON.stringify(data)
    window.outputData = data
}

window.writeToOutput = () => {
    window.output.value = JSON.stringify(window.outputData)
}

function calculateDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2)
    );
}

function calculateMidpoint(point1, point2) {
    if (point1[0] === point2[0] && point1[1] === point2[1]) {
        return null; // Return null if the points are the same
    }

    // Calculate the distance between the two points
    const distance = calculateDistance(point1, point2);

    // Check if the distance is less than 10
    if (distance < 5) {
        // Calculate the midpoint
        const midpoint = [
            (point1[0] + point2[0]) / 2,
            (point1[1] + point2[1]) / 2
        ];
        return midpoint;
    } else {
        return null; // Return null if the distance is 10 or more
    }
}