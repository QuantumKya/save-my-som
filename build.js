const fs = require('fs');
const { fullDevlogPage, fullProjectPage, devlogBlock, projectBadge, toHTMLTitle } = require('./htmlblocks.mjs');

function abc() {
    const data = JSON.parse(fs.readFileSync('./build/project_data.json'));

    const projs = data.projects;
    const devlogimgs = data.devlogimgs;

    state = 'projectcat';

    const badges = projs.map((proj) => {
        return projectBadge(proj.content, toHTMLTitle(proj.content.title) + '.html', proj.bannerpath);
    }).join('\n');

    fs.writeFileSync('build/html/index.html',
        fullProjectPage(badges)
    );

    state = 'devlogs';

    projs.forEach((proj, i) => {
        const dev1 = proj.content.devlogs;
        const devlogs = [...proj.content.devlogs].sort((a,b)=>Date.parse(a.created_at) - Date.parse(b.created_at));
        const sortmap = {};
        dev1.forEach((a, iii) => sortmap[devlogs.indexOf(a)] = iii);

        const devlogstr = devlogs.map((devlog, ii) => {
            return devlogBlock(devlog, devlogimgs[i][sortmap[ii]].file, devlogimgs[i][sortmap[ii]].typ);
        }).join('\n');
    
        fs.writeFileSync(`build/html/${toHTMLTitle(proj.content.title)}.html`, 
            fullDevlogPage(proj.content.title, devlogstr)
        );
        
        projress = `${i+1}/${projs.length}`;
    });
    state = 'done';
}

let spin = 0;
let state = 'unstarted';
let projress = '0/0';

function progress(interval) {
    const update = setInterval(() => {
        if (state === 'done') {
            process.stdout.clearLine();
            process.stdout.write(`\rDone! HTML, CSS, and attachments are located in /build.\n`);
            clearInterval(update);
            return;
        }

        const spinsym = ['-', '\\', '|', '/'][spin%4];
        spin++;

        if (state === 'unstarted') return;
        else if (state === 'projectcat') {
            process.stdout.write(`\rCreating Project Catalogue Page... ${spinsym} `);
        }
        else if (state === 'devlogs') {
            process.stdout.write(`\rCreating individual project pages (${projress})... ${spinsym} `);
        }
        else if (state === 'images') {
            const distance = Math.floor(doneattachments / totalattachments * 100);
            process.stdout.write(`\rDownloading attachments & generating HTML... ${distance}% ${spinsym} `);
        }
    }, interval);
}

progress(200);
abc();