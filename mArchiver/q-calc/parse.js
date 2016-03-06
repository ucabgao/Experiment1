var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('q2.csv'),
    output: process.stdout,
    // output: fs.createWriteStream('qqq.json'),
    terminal: false
});

var cards=[];

rd.on('line', function(line) {
            console.log(line);

    if (line[0]==='r') {
        var data = line.split(',');
        // console.log(data);
        var card = {
            "lev"   : data[2][0],
            "name"  : data[2],
            "vit"   : parseFloat(data[3]),
            "str"   : parseFloat(data[4]),
            "mag"   : parseFloat(data[5]),
            "agi"   : parseFloat(data[6]),
            "def"   : parseFloat(data[7]),
            "inc":{
                "vit": parseFloat(data[8]),
                "str": parseFloat(data[9]),
                "mag": parseFloat(data[10]),
                "agi": parseFloat(data[11]),
                "def": parseFloat(data[12])
            }
        }
        cards.push(card);
    }
});

rd.on('close', function() {
    fs.writeFile("./data/data.json", JSON.stringify(cards), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
});

