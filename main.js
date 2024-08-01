let input = document.querySelector("input");
input.addEventListener("change", readFile);

let partsUnformatted = [];

function readFile() {
    let fileReader = new FileReader();
    fileReader.readAsText(input.files[0]);

    fileReader.onload = function() {
        let result = fileReader.result;
        let split = result.split("\n");
        // don't need header
        split.shift();

        for(let part of split) {
            partsUnformatted.push(part);
        }
    }

}

let output = "<inventory>"

/**
 * -Need everything in INVENTORY tag
 * -Every part must be in ITEM tag
 * -Need ITEMTYPE, ITEMID, COLOR, and QTY
 */

output += "<inventory>";