const fs = require('fs');
const readline = require('readline');

const dbPath = './db/';
let users = new Set();
/**
 * @returns a random string of letters and numbers with a length of 8
 */
const getRandomString = () => Math.random().toString(36).substr(2, 10);
/**
 * Store a number for a user
 * @param {string} id id of the user
 * @param {number} number number to be saved
 */
const saveNumber = (id,number) => {
    users.add(id);
    fs.writeFileSync(dbPath+id,number.toString());
}
/**
 * @returns a unique identifier for a user
 */
const generateId = () => {
    let id;
    do {
        id = getRandomString();
    }
    while(users.has(id));
    return id;
}
/**
 * 
 * @param {string} id id of the user 
 * @returns the number of the user
 */
const getNumberForId = (id) => {
    const filename = dbPath+id;
    if(fs.existsSync(filename)) {
        const text = fs.readFileSync(filename);
        const number = Number.parseInt(text);
        return number;
    } 
    return undefined;
}
/**
 * Checks if user exists in database
 * @param {string} id id of the user
 * @returns true if the database includes the user
 */
const isUser = (id) => {
    return users.has(id);
}
/**
 * Initialize server by deleting the old database file
 */
const initServer = () => {
    console.log('running on port 8080');
    if(fs.existsSync(dbPath)) {
        fs.rmdirSync(dbPath,{recursive:true});
    }
    fs.mkdirSync(dbPath);
}

module.exports= {
    generateId,
    getNumberForId,
    saveNumber,
    isUser,
    initServer
}