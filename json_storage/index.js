const express = require('express');
const app = express();
app.use(express.json());

let db = {};

app.put('/:jsonPath', (req, res) => {
    const jsonPath = req.params.jsonPath;
    const jsonData = req.body;
    db[jsonPath] = jsonData;
    res.send({status: 'success', message: 'JSON stored successfully'});
});

app.get('/:jsonPath', (req, res) => {
    const jsonPath = req.params.jsonPath;
    if (db[jsonPath]) {
        res.send(db[jsonPath]);
    } else {
        res.status(404).send({status: 'error', message: 'JSON not found'});
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
