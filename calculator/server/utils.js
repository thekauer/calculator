const fs = require('fs');
const readline = require('readline');

const dbFile = 'db.txt';
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
    fs.appendFileSync(dbFile,id + " " +number.toString() + "\n");
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
    const fileStream = fs.createReadStream(dbFile);

    const rl = readline.createInterface({
        input: fileStream,
    });
    const get = async () => {
        for await (const line of rl) {
            const [first, second, ...rest] = line.split(' ');
            if (first === id) {
                return second;
            }
        }
    }
    return get();
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
    if(fs.existsSync(dbFile)) {
        fs.unlinkSync(dbFile);
    }
}

module.exports= {
    generateId,
    getNumberForId,
    saveNumber,
    isUser,
    initServer
}