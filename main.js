let table;
let maxHeight = 700;
let aggData;
let maxCount, minCount;
let topPadding = 30;
let bottomPadding = 50;
let sidePadding = 50;
let points = [];
let fontRegular;
let bgColor = "#D7ADD1";

function preload() {
    table = loadTable("data.csv", "csv", "header");
    fontRegular = loadFont("IBMPlexMono-Light.ttf");
}

function setup() {
    createCanvas(1000, 400);

    noLoop();

    tableObj = table.getObject();

    aggData = aggregateByHour(tableObj);

    // console.log(aggData);

    maxCount = _.maxBy(aggData, "count").count;
    minCount = _.minBy(aggData, "count").count;

    for (let i = 0; i < aggData.length; i++) {
        let thisP = aggData[i];
        let y = map(thisP.count, minCount, maxCount, height - bottomPadding, topPadding);
        let x = map(thisP.hour, 0, 23, sidePadding, width - sidePadding);
        let obj = { x, y, count: thisP.count };
        points.push(obj);
    }
}

function draw() {
    background(bgColor);

    noStroke();

    fill("white");

    beginShape(); // white background shape

    vertex(sidePadding / 2, height - bottomPadding);

    for (let i = 0; i < points.length; i++) {
        vertex(points[i].x, points[i].y);
    }

    vertex(width - sidePadding / 2, height - bottomPadding);

    endShape();

    stroke(bgColor);
    strokeWeight(3);

    for (let i = 0; i < points.length; i++) {
        if (i != points.length - 1) {
            line(points[i].x, points[i].y, points[i + 1].x, height - bottomPadding);
            line(points[i].x, height - bottomPadding, points[i + 1].x, points[i + 1].y);
        }
    }

    stroke("black");
    strokeWeight(8);

    for (let i = 0; i < points.length; i++) {
        if (points[i].count !== 0) {
            point(points[i].x, points[i].y);
        }
    }

    strokeWeight(1);
    textSize(22);
    fill("black");
    textFont(fontRegular);
    textAlign(CENTER, CENTER);
    text("12 AM", width - sidePadding, height - 30);
    text("12 PM", width / 2, height - 30);
    text("12 AM", sidePadding, height - 30);

    // saveCanvas("output1.png");
}

function aggregateByHour(tableObj) {
    let hours = new Array(24).fill(0);

    let dataProc = _.chain(tableObj)
        .countBy((d) => moment(d.dateTime, "MM/DD/YYYY hh:mm:ss").format("HH"))
        .map((count, hour) => ({ hour, count }))
        .value();

    dataProc.forEach((d) => {
        hours[+d.hour] = d.count;
    });

    let finalData = _.map(hours, (count, hour) => {
        return { hour, count };
    });

    return finalData;
}