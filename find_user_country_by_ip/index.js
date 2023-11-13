const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const requestIp = require('request-ip');

const app = express();
const port = 3000;

let ipData = [];

fs.createReadStream('IP2LOCATION-LITE-DB1.CSV')
    .pipe(csv())
    .on('data', (row) => {
        ipData.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });

app.get('/ip', (req, res) => {
    const clientIp = requestIp.getClientIp(req); 
    const ipNum = ip2num(clientIp);
    const ipInfo = getIpInfo(ipNum);
    res.send(clientIp + '\n' + ipNum + '\n' +ipInfo);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

function ip2num(ip) {
    var num = 0;
    ip.split(".").forEach(function(octet) {
        num <<= 8;
        num += parseInt(octet);
    });
    return num >>> 0;
}

function getIpInfo(ipNum) {
    for (let i = 0; i < ipData.length; i++) {
        if (ipNum >= ipData[i][0] && ipNum <= ipData[i][1]) {
            return {
                ipRange: `${ipData[i][0]} - ${ipData[i][1]}`,
                country: ipData[i][3]
            };
        }
    }
    return 'IP not found in database';
}
