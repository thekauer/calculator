const fs = require('fs');
const readline = require('readline');

const dbFile = 'db.txt';
let users = new Set();

const getRandomString = () => Math.random().toString(36).substr(2, 10);

const saveNumber = (id,number) => {
    users.add(id);
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

const isUser = (id) => {
    return users.has(id);
}

const initServer = () => {
    console.log('running on port 8080');
    fs.unlinkSync(dbFile);
}

module.exports= {
    generateId,
    getNumberForId,
    saveNumber,
    isUser,
    initServer
}