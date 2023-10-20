const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

var arr = [];

function askQuestion() {
    readline.question(`Enter a set of words or/and numbers separated by a space:\n`, str => {
        arr = str.split(' ');

        readline.question(
            `How would you like to sort values?
             1. Words by name (from A to Z).
             2. Show digits from the smallest.
             3. Show digits from the biggest.
             4. Words by quantity of letters.
             5. Only unique words.\n`,
            input => {
                if(input.toLocaleLowerCase() === 'exit'){
                    readline.close();
                    return;
                }

                let num = Number(input);
                switch(num){
                    case 1:
                        console.log(arr.filter(item => isNaN(item)).sort());
                        break;
                    case 2:
                        console.log(arr.filter(item => !isNaN(item)).sort((a, b) => a - b));
                        break;
                    case 3:
                        console.log(arr.filter(item => !isNaN(item)).sort((a, b) => b - a));
                        break;
                    case 4:
                        console.log(arr.filter(item => isNaN(item)).sort((a, b) => b.length - a.length));
                        break;
                    case 5:
                        let uniqueWords = [...new Set(arr.filter(item => isNaN(item)))];
                        console.log(uniqueWords);
                        break;
                    default:
                        console.log("there is no such menu item");
                }

                askQuestion();
            });
    });
}

askQuestion();
