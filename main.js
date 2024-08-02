const colorIds = ["not applicable",0,"white",1,"very light grey",49,"very light bluish grey",99,"light bluish grey",86,"light grey",9,"dark grey",10,"dark bluish grey",85,"black",11,"dark red",59,"red",5,"reddish orange",167,"dark salmon",231,"salmon",25,"coral",220,"light salmon",26,"sand red",58,"dark brown",120,"umber",168,"brown",8,"reddish brown",88,"light brown",91,"medium brown",240,"fabuland brown",106,"dark tan",69,"tan",2,"light nougat",90,"medium tan",241,"nougat",28,"medium nougat",150,"dark nougat",225,"sienna",169,"fabuland orange",160,"earth orange",29,"dark orange",68,"rust",27,"neon orange",165,"orange",4,"medium orange",31,"light orange",32,"bright light orange",110,"very light orange",96,"dark yellow",161,"yellow",3,"light yellow",33,"bright light yellow",103,"neon yellow",236,"neon green",166,"light lime",35,"yellowish green",158,"medium lime",76,"lime",34,"fabuland lime",248,"olive green",155,"dark olive green",242,"dark green",80,"green",6,"bright green",36,"medium green",37,"light green",38,"sand green",48,"dark turquoise",39,"light turquoise",40,"aqua",41,"light aqua",152,"dark blue",63,"blue",7,"dark azure",153,"little robots blue",247,"maersk blue",72,"medium azure",156,"sky blue",87,"medium blue",42,"bright light blue",105,"light blue",62,"sand blue",55,"dark blue-violet",109,"violet",43,"blue-violet",97,"lilac",245,"medium violet",73,"light lilac",246,"light violet",44,"dark purple",89,"purple",24,"light purple",93,"medium lavender",157,"lavender",154,"clikits lavender",227,"sand purple",54,"magenta",71,"dark pink",47,"medium dark pink",94,"bright pink",104,"pink",23,"light pink",56,"trans-clear",12,"trans-brown (old trans-black)",13,"trans-black (2023)",251,"trans-red",17,"trans-neon orange",18,"trans-orange",98,"trans-light orange",164,"trans-neon yellow",121,"trans-yellow",19,"trans-neon green",16,"trans-bright green",108,"trans-light green",221,"trans-light bright green",226,"trans-green",20,"trans-dark blue",14,"trans-medium blue",74,"trans-light blue",15,"trans-aqua",113,"trans-light purple",114,"trans-medium purple",234,"trans-purple",51,"trans-dark pink",50,"trans-pink",107,"chrome gold",21,"chrome silver",22,"chrome antique brass",57,"chrome black",122,"chrome blue",52,"chrome green",64,"chrome pink",82,"pearl white",83,"pearl very light grey",119,"pearl light grey",66,"flat silver",95,"bionicle silver",239,"pearl dark grey",77,"pearl black",244,"pearl light gold",61,"pearl gold",115,"reddish gold",235,"bionicle gold",238,"flat dark gold",81,"reddish copper",249,"copper",84,"bionicle copper",237,"pearl brown",255,"pearl red",252,"pearl green",253,"pearl blue",254,"pearl sand blue",78,"pearl sand purple",243,"satin trans-clear",228,"satin trans-brown",229,"satin trans-yellow",170,"satin trans-bright green",233,"satin trans-light blue",223,"satin trans-dark blue",232,"satin trans-purple",230,"satin trans-dark pink",224,"metallic silver",67,"metallic green",70,"metallic gold",65,"metallic copper",250,"milky white",60,"glow in dark white",159,"glow in dark opaque",46,"glow in dark trans",118,"glitter trans-clear",101,"glitter trans-orange",222,"glitter trans-neon green",163,"glitter trans-light blue",162,"glitter trans-purple",102,"glitter trans-dark pink",100,"speckle black-silver",111,"speckle black-gold",151,"speckle black-copper",116,"speckle dbgrey-silver",117,"mx white",123,"mx light bluish grey",124,"mx light grey",125,"mx charcoal grey",126,"mx tile grey",127,"mx black",128,"mx tile brown",131,"mx terracotta",134,"mx brown",132,"mx buff",133,"mx red",129,"mx pink red",130,"mx orange",135,"mx light orange",136,"mx light yellow",137,"mx ochre yellow",138,"mx lemon",139,"mx pastel green",141,"mx olive green",140,"mx aqua green",142,"mx teal blue",146,"mx tile blue",143,"mx medium blue",144,"mx pastel blue",145,"mx violet",147,"mx pink",148,"mx clear",149,"mx foil dark grey",210,"mx foil light grey",211,"mx foil dark green",212,"mx foil light green",213,"mx foil dark blue",214,"mx foil light blue",215,"mx foil violet",216,"mx foil red",217,"mx foil yellow",218, "mx foil orange", 21];

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
        let colorName = split[sectionIndexMap.get("color")];
        color = colorIds[colorIds.indexOf(colorName.toLowerCase()) + 1];
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