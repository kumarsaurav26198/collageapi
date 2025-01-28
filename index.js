var express = require('express');
var csv = require('csv');
var fs = require("fs");

var app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var colleges = [];

fs.readFile('db/database.csv', (err, data) => {
    if (err) {
        console.error("[cAPi] : Error reading file:", err);
        return;
    }

    console.log("[cAPi] : File read !");
    csv.parse(data, function (err, parsedData) {
        if (err) {
            console.error("[cAPi] : CSV Parsing Error:", err);
            return;
        }
        colleges = parsedData;
        console.log("[cAPi] : CSV Loaded !");
    });
});

app.get('/', (req, res) => {
    res.send("Colleges API : SriGuru Institute of Technology, Coimbatore");
});

app.post('/colleges/total', (req, res) => {
    if (!colleges) return res.status(500).json({ error: "Data not loaded" });

    res.json({ total: colleges.length });
});

app.post('/colleges/search', (req, res) => {
    if (!colleges) return res.status(500).json({ error: "Data not loaded" });

    let keyword = req.headers.keyword?.toLowerCase() || "";
    let result = colleges.filter(college => college[2]?.toLowerCase().includes(keyword));

    res.json(result);
});

app.post('/colleges/state', (req, res) => {
    if (!colleges) return res.status(500).json({ error: "Data not loaded" });

    let state = req.body.state?.toLowerCase();
    let offset = parseInt(req.body.offset, 10) || 0;
    let result = colleges.filter(college => college[4]?.toLowerCase().includes(state));

    let limit = Math.min(offset + 10, result.length);
    let paginatedResult = result.slice(offset, limit);

    res.json(paginatedResult);
});

app.post('/colleges/district', (req, res) => {
    if (!colleges) return res.status(500).json({ error: "Data not loaded" });

    let district = req.body.district?.toLowerCase();
    let offset = parseInt(req.body.offset, 10) || 0;
    let result = colleges.filter(college => college[5]?.toLowerCase().includes(district));

    let limit = Math.min(offset + 10, result.length);
    let paginatedResult = result.slice(offset, limit);

    res.json(paginatedResult);
});

app.post('/allstates', (req, res) => {
    if (!colleges) return res.status(500).json({ error: "Data not loaded" });

    let states = [...new Set(colleges.map(college => college[4]))]; // Unique states
    res.json(states);
});

app.post('/districts', (req, res) => {
    if (!colleges) return res.status(500).json({ error: "Data not loaded" });

    let state = req.body.state?.toLowerCase();
    let districts = [...new Set(colleges.filter(college => college[4]?.toLowerCase().includes(state)).map(college => college[5]))];

    res.json(districts);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
