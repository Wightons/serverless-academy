import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'database.txt');

const questions = [
    {
        type: 'input',
        message: "Enter the user's name. To cancel press ENTER:",
        name: 'user'
    },
    {
        type: 'list',
        name: 'gender',
        message: 'Choose gender:',
        choices: ["Male", "Female"],
        default: "Male",
        when: function(answers) {
            return answers.user.trim().length !== 0;
        }
    },
    {
        type: 'input',
        message: 'Enter your age:',
        name: 'age',
        when: function(answers) {
            return answers.user.trim().length !== 0;
        }
    }
];

function addUser(user){
    const userString = JSON.stringify(user);
    fs.appendFileSync(DB_PATH, userString + '\n');
}

function getAllUsers(){
    const fileContents = fs.readFileSync(DB_PATH, 'utf-8');
    const userStrings = fileContents.split('\n').filter(Boolean);
    return userStrings.map(userStr => JSON.parse(userStr));
}

function getUserByName(name){
    const users = getAllUsers();
    return users.find(user => user.user.toLowerCase() === name.toLowerCase());
}

function ask(){
    inquirer.prompt(questions).then(answers=>{
        if (answers.user.trim().length === 0) {
            inquirer
                .prompt([
                  {
                    type: 'confirm',
                    name: 'search',
                    message: 'Would you like to search values in DB?',
                  },
                ])
                .then(answers => {
                  if (answers.search) {
                    inquirer.prompt([
                      {
                        type: 'input',
                        name: 'name',
                        message: 'Enter the name of the user you want to search for:',
                      },
                    ])
                    .then(answers => {
                      const user = getUserByName(answers.name);
                      if (user) {
                        console.log('User found:', user);
                      } else {
                        console.log('No user found with that name.');
                      }
                    });
                  }
                });
        } else {
            addUser(answers);
            ask();
        }
    });
}

ask();
