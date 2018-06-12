const options = {
    TITLE: 'hello, friend',
    ROOT_FOLDER: /bookmarks (tool)?bar/i,
    TITLE_COLOR: '#4d4f68',
    BACKGROUND: '#282936',
    COLOR_THEME: [
        '#ea51b2',
        '#00f769',
        '#ebff87',
        '#62d6e8',
        '#b45bcf',
        '#a1efe4',
        '#e9e9f4',
    ],
    MAX_NAME_LENGTH: 30,
}

const folders = [];
const errors = [];

chrome.bookmarks.getTree(items => {
    const bookmarksBar = items[0].children.find(x => options.ROOT_FOLDER.test(x.title));

    if (!bookmarksBar) {
        console.error(`Was expecting a folder called '${options.ROOT_FOLDER}'`);
    }

    const rootFolder = { title: '/', children: [] };

    bookmarksBar.children.forEach(node => {
        const folder = { children: [] };

        if (node.children && node.children.length) {
            folder.title = node.title;

            node.children.forEach(child => {
                if (!child.url.startsWith('javascript:')) {
                    folder.children.push({ title: child.title, url: child.url });
                }
            });
        } else { // if not a folder, it's a shortcut
            if (!node.url.startsWith('javascript:')) {
                rootFolder.children.push({ title: node.title, url: node.url });
            }
        }

        if (folder.children.length) {
            folders.push(folder);
        }
    });

    if (rootFolder.children.length) {
        folders.unshift(rootFolder);
    }

    render(folders);
});

function render(folders) {
    const colors = options.COLOR_THEME;
    const root = document.getElementById('container');

    let colourIndex = 0;

    root.innerHTML = folders.map(folder => {
        const listItems = folder.children.map(item => {
            if (item.title === '-') {
                return '<li class="separator">&nbsp;<li>';
            }

            const title = trunc(item.title);
            return `<li><a href="${item.url}" title="${title.endsWith('...') ? item.title : ''}">${title}</a></li>`;
        }).join('');

        colourIndex = (colourIndex >= colors.length - 1) ? 0 : (colourIndex + 1);
        return `<div class="column"><h2 class="folder-name" style="color: ${colors[colourIndex]}">${folder.title}</h1><ul>${listItems}</ul></div>`;
    }).join('');

    document.getElementById('welcome').innerHTML = options.TITLE;
}

function trunc(text) {
    if (text.length <= (options.MAX_NAME_LENGTH - 2)) {
        return text;
    }

    return text.substr(0, options.MAX_NAME_LENGTH) + '...'
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.background = options.BACKGROUND;
    document.getElementById('welcome').style.color = options.TITLE_COLOR;
});
