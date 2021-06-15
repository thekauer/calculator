const fs = require('fs');
const readline = require('readline');

const dbFile = 'db.txt';
let users = new Set();

const getRandomString = () => Math.random().toString(36).substr(2, 10);

const saveNumber = (id,number) => {
    fs.appendFileSync(dbFile,id + " " +number.toString() + "\n");
}
const generateId = () => {
    let id;
    do {
        id = getRandomString();
    }
    while(users.has(id));
    return id;
}

const getNumberForId = (id) => {
    const fileStream = fs.createReadStream(dbFile);

    const rl = readline.createInterface({
        input: fileStream,
    });

    for (const line of rl) { //FIX error rl not iterable
        const [first, second, ...rest] = line.split(' ');
        if (first === id) {
            return second;
        }
    }
}

const isUser = (id) => {
    return users.has(id);
}


module.exports= {
    generateId,
    getNumberForId,
    saveNumber,
    isUser
}