function projectBadge(project, projpath, imgPath) {
    return `

<div class="project-badge">
    <img src="${imgPath}" alt="banner">
    <div>
        <a href="/${projpath}">${project.title}</a>
        <p>${project.description}</p>
    </div>
</div>

    `;
}

function fullProjectPage(badges) {
    return `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SoM Projects</title>
    <link rel="stylesheet" type="text/css" href="./style.css">
</head>
<body>
<div class="project-cat">
    <h1>Projects</h1>
    ${badges}
</div>
</body>
</html>

    `;
}

function fullDevlogPage(projName, devlogSection) {
    return `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${projName}</title>
    <link rel="stylesheet" type="text/css" href="./style.css">
</head>
<body>
<div class="devlog-container">
    ${devlogSection}
</div>
</body>
</html>

    `;
}

const convertSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${hours}h${minutes}`
}

function devlogBlock(devlog, imgfile, type) {
    return `

<div class="devlog-block">
    <div class="devlog-info">
        <p>Published: ${devlog.created_at.slice(0, 10)}</p>
        <p>Time Spent (in seconds): ${convertSeconds(devlog.time_seconds)}</p>
    </div>
    <p>${devlog.text}</p>
    <${type ? 'img' : 'video controls'} src="${imgfile}" alt="devlog attachment">
</div>

    `;
}

function toHTMLTitle(a) {
    return a.replace(/\s+|_+/g, '_').toLowerCase();
}

export {
    fullDevlogPage,
    devlogBlock,
    projectBadge,
    fullProjectPage,
    toHTMLTitle,
}