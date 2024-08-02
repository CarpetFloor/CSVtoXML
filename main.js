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

        parseParts(split);
    }
}

let sectionIndexMap = new Map();

let output = "";

function parseParts(toParse) {
    for(let i = 0; i < config.length; i++) {
        if(config[i] != "na") {
            sectionIndexMap.set(config[i], i);
        }
    }

    output += "<INVENTORY>";

    for(let i = 0; i < toParse.length; i++) {
        let itemid = "";
        let color = "";
        let qty = "";

        let split = null;

        // handle part with one data value having commas differently
        if(toParse[i].includes("\"")) {
            split = [];

            let foundClosingQuote = true;
            let substring = "";

            for(let c = 0; c < toParse[i].length; c++) {
                if((toParse[i][c] != "\"") && (toParse[i][c] != ",")) {
                    substring += toParse[i][c];
                }
                
                if(toParse[i][c] == "\"") {
                    foundClosingQuote = !(foundClosingQuote);
                }

                if(foundClosingQuote && (toParse[i][c] == ",")) {
                    split.push(substring);

                    substring = "";
                }
            }

            // for somer reason the final substring has the carriage return escape character
            split.push(substring.replace("\r", ""));
        }
        else {
            split = toParse[i].split(",");
        }

        // find the necessary data values
        itemid = split[sectionIndexMap.get("itemid")];
        color = split[sectionIndexMap.get("color")];
        qty = split[sectionIndexMap.get("qty")];

        // add on to the output string
        output += "\n\t<ITEM>";
        output += "\n\t\t<ITEMTYPE>P</ITEMTYPE>";
        output += "\n\t\t<ITEMID>" + itemid + "</ITEMID>";
        output += "\n\t\t<COLOR>" + color + "</COLOR>";
        output += "\n\t\t<QTY>" + qty + "</QTY>";
        output += "\n\t</ITEM>"
    }

    output += "\n</INVENTORY>";

    let htmlOutput = output.replaceAll("<", "&lt;");
    htmlOutput = htmlOutput.replaceAll(">", "&gt;");
    htmlOutput = htmlOutput.replaceAll("\t", "&nbsp;")

    document.querySelector("#outputText").innerText = output;
}

let indicatorTimeout = null;

document.querySelector("#copy").addEventListener("click", function() {
    navigator.clipboard.writeText(output);
    document.querySelector("#indicator").style.opacity = "1";

    if(indicatorTimeout != null) {
        window.clearTimeout(indicatorTimeout);
        indicatorTimeout = null;
    }

    indicatorTimeout = window.setTimeout(function() {
        document.querySelector("#indicator").style.opacity = "0";
        indicatorActive = false;
    }, 2000);
});

let downloadButton = document.querySelector("#download");
downloadButton.addEventListener("click", function() {
    let file = new Blob([output], {type: "text/plain"});

    downloadButton.href = URL.createObjectURL(file);
    downloadButton.download = "output.xml";
})