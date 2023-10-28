const fs = require('fs');

fs.readFile('data.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file from disk:", err);
        return;
    }
    try {
        const data = JSON.parse(jsonString);
        const result = {};

        for (const item of data) {
            const userId = item.user._id;
            const userName = item.user.name;
            const vacation = {
                startDate: item.startDate,
                endDate: item.endDate
            };

            if (!result[userId]) {
                result[userId] = {
                    userId: userId,
                    userName: userName,
                    vacations: []
                };
            }

            result[userId].vacations.push(vacation);
        }

        fs.writeFile('output.json', JSON.stringify(Object.values(result), null, 2), err => {
            if (err) console.log('Error writing file:', err);
        });

    } catch(err) {
        console.log('Error parsing JSON string:', err);
    }
});
