const axios = require('axios');
const fs = require('fs');

const args = process.argv.slice(2);

let cookiefile;
for (const arg of args) {
    if (arg.startsWith('cookiefile=')) {
        cookiefile = arg.split('=')[1];
    }
}

const journey = args.find(arg => arg.startsWith('_journey_session='));
const ahoy = args.find(arg => arg.startsWith('ahoy_visitor='));
if (!journey || !ahoy) {
    const starr = ["\"_journey_session\"", "\"ahoy_visitor\""];
    const varr = [journey, ahoy];
    const truearr = starr.filter((a,i)=>(!varr[i]));
    if (!cookiefile) console.error(`You didn\'t supply the cookies! ${truearr.join(', ')} ${truearr.length > 1 ? 'are' : 'is'} missing`);
}

const cookieStr = cookiefile ? fs.readFileSync(cookiefile).toString().split('\n').join('; ').replace(/[\r\s]/g, '') : `${journey};${ahoy}`.replace(/[\r\n\s]+/g, ' ').trim();

let projs = [];
let projshtml = {};
let devlogsimg = {};

let totalattachments = 0;
let doneattachments = 0;
let state = 'unstarted';

if (fs.readdirSync('./build/html').includes('img')) {
    fs.rmSync('./build/html/img', { recursive: true });
    fs.mkdirSync('./build/html/img');
}

const arrayOrderingThing = (arr) => Object.keys(arr).sort((a,b) => Number(a.slice(2)) - Number(b.slice(2))).map(a=>arr[a])

async function fetchProjects() {
    try {
        state = 'projids';
        const res = await axios.get(`https://summer.hackclub.com/my_projects`, {
            headers: {
                'Cookie': cookieStr
            }
        });
        const html = res.data;
        
        projs = [...html.matchAll(/href="\/projects\/(\d+)"/g)].map(m=>Number(m[1]));

        await Promise.all(projs.map((id, i) => calcSize(id, i)));
        await Promise.all(projs.map((id, i) => processProject(id, i)));

        state = 'savingdata';

        const megaobject = {
            projects: arrayOrderingThing(projshtml),
            devlogimgs: arrayOrderingThing(devlogsimg).map(a=>arrayOrderingThing(a))
        };

        fs.writeFileSync('./build/project_data.json', JSON.stringify(megaobject));
        state = 'done';
    }
    catch (error) {
        console.error("Error while fetching:\n\t", error);
    }
}

async function fetchWCookies(url) {
    return await fetch(url, {
        method: 'GET',
        headers: {
            'cookie': String(cookieStr),
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json());
}

async function downloadImage(url, filename) {
    try {
        const res = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });
        
        const ending = url.slice(url.indexOf('.', url.length - 7));
        const path = `build/html/img/` + filename + ending;

        const lekhak = fs.createWriteStream(path);
        res.data.pipe(lekhak);

        return new Promise((res, rej) => {
            lekhak.on('finish', () => {
                res({ filepath: path.replace(/^build\/html\//, ''), typ: ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp', '.svg', '.avif'].includes(ending) });
            });
            lekhak.on('error', (err) => {
                console.error(`Failed to save image:\n\t`, err);
                rej(err);
            });
        });
    }
    catch (error) {
        console.error("Problem downloading image:\n\t", error);
    }
}

async function calcSize(projid, projiter) {
    const res = await fetchWCookies(`https://summer.hackclub.com/api/v1/projects/${projid}`)
    .catch(err => console.error("Error while processing project:\n\t", err));

    const devlogcount = res.devlogs_count;
    totalattachments += devlogcount;
}

async function processProject(projid, projiter) {
    state = 'images';
    const res = await fetchWCookies(`https://summer.hackclub.com/api/v1/projects/${projid}`)
    .catch(err => console.error("Error while processing project:\n\t", err));

    downloadImage(res.banner, `proj${projiter}/banner`)
    .then(resp => projshtml[`id${projiter}`] = { content: res, bannerpath: resp.filepath });

    fs.mkdirSync(`build/html/img/proj${projiter}`);
    devlogsimg[`id${projiter}`] = {};
    await Promise.all(res.devlogs.map(async (devlog, i) => {
        const img = await downloadImage(devlog.attachment, `proj${projiter}/devlog${i}_attachment`);
        devlogsimg[`id${projiter}`][`id${i}`] = { file: img.filepath, typ: img.typ };
        if (doneattachments < totalattachments) doneattachments++;
    }));

    if (projiter >= projs.length - 1) state = 'mainbuild';
}

let spin = 0;

function progress(interval) {
    const update = setInterval(() => {
        if (state === 'done') {
            process.stdout.clearLine();
            process.stdout.write(`\rDone! Project data and attachments are located in /build.\n`);
            clearInterval(update);
            return;
        }

        const spinsym = ['-', '\\', '|', '/'][spin%4];
        spin++;

        if (state === 'unstarted') return;
        else if (state === 'projids') {
            process.stdout.write(`\rGathering project IDs... ${spinsym} `);
        }
        else if (state === 'projspage' || state === 'mainbuild') {
            process.stdout.write(`\rCreating Project Catalogue Page... ${spinsym} `);
        }
        else if (state === 'savingdata') {
            process.stdout.write(`\rSaving data to JSON... ${spinsym} `);
        }
        else if (state === 'images') {
            const distance = Math.floor(doneattachments / totalattachments * 100);
            process.stdout.write(`\rDownloading attachments & generating HTML... ${distance}% ${spinsym} `);
        }
    }, interval);
}

progress(200);
fetchProjects();