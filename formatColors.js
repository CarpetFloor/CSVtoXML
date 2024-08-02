const fs = require('node:fs');

fs.readFile('colorIdsUnformatted.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  parseData(data);
});

function parseData(data) {
    let split = data.split("\n");

    let output = "[";
    
    for(let i = 0; i < split.length; i++) {
        if(i % 2 == 0) {
            output += '"' + 
                ((split[i].toLowerCase()).substring(0, split[i].length - 1)).replace("color id: ", "") + 
                '"';
        }
        else {
            output += ((split[i].toLowerCase()).substring(0, split[i].length - 1)).replace("color id: ", "");
        }

        if(i < split.length - 1) {
            output += ",";
        }
    }

    output += "]";

    output = output.replaceAll("\n", "");

    fs.writeFile('colorIdsTest.txt', output, err => {
    if (err) {
        console.error(err);
    } else {
        console.log("done");
    }
    });
}