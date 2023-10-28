const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'Files');

const files = fs.readdirSync(directoryPath, 'utf-8');
let usernameMap = {};

files.forEach((file, index) => {
    let usernames = fs.readFileSync(path.join(directoryPath, file), 'utf-8').split('\n');
    usernames.forEach(username => {
        if (!usernameMap[username]) {
            usernameMap[username] = new Set();
        }
        usernameMap[username].add(index);
    });
});

function uniqueValues() {
    return Object.keys(usernameMap).length;
}

function existInAllFiles() {
    let count = 0;
    for (let username in usernameMap) {
        if (usernameMap[username].size === files.length) {
            count++;
        }
    }
    return count;
}

function existInAtleastTen() {
    let count = 0;
    for (let username in usernameMap) {
        if (usernameMap[username].size >= 10) {
            count++;
        }
    }
    return count;
}


console.log(uniqueValues());
console.log(existInAllFiles());
console.log(existInAtleastTen());