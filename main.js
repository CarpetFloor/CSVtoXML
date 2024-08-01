// config stuff
let configInputElems = [...(document.querySelector(".input").children)];
for(let elem of configInputElems) {
    let id = elem.id;

    elem.addEventListener("click", function() {
        addConfigOption(id);
    })
}

let config = [];
let configDisplay = document.querySelector(".input").nextElementSibling;

function addConfigOption(id) {
    if(id == "delete") {
        let childCount = [...configDisplay.children].length;
        
        if(childCount > 1) {
            let deleteElem = configDisplay.children[childCount - 1];
            
            config.splice(config.indexOf(deleteElem.innerText), 1);
            deleteElem.remove();
            
            childCount = [...configDisplay.children].length;
            let commaElem = configDisplay.children[childCount - 1];
            commaElem.remove();
        }
        else if(childCount == 1) {
            let deleteElem = configDisplay.children[childCount - 1];
            
            config.splice(config.indexOf(deleteElem.innerText), 1);
            deleteElem.remove();
        }
    }
    else if(!(config.includes(id)) || (id == "na")) {
        config.push(id);

        if([...configDisplay.children].length > 0) {
            let comma = document.createElement("p");
            comma.className = "comma";
            comma.innerText = ",";
            
            configDisplay.appendChild(comma);
        }
    
        let elem = document.createElement("p");
        elem.className = "nonComma";
        elem.innerText = id;
    
        configDisplay.appendChild(elem);
    }
}

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