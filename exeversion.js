const readline = require('readline');
const fs = require('fs');
const { execSync } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let ahoy = '';
let journey = '';

rl.question('What is your "ahoy_visitor" cookie?', (res) => ahoy = res);
rl.question('What is your "_journey_session" cookie?', (res) => journey = res);

fs.writeFileSync('cookie.txt', `_journey_session=${journey}\nahoy_visitor=${ahoy}`);
execSync('npm link');
execSync('save-my-som get --cookiefile="cookie.txt"');
execSync('save-my-som build');