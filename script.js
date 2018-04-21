const folders = []

chrome.bookmarks.getTree(items => {
    const bookmarksBar = items[0].children.find(x => /bookmarks bar/i.test(x.title));
    const rootFolder = { title: '/', children: [] };

    bookmarksBar.children.forEach(node => {
        const folder = { children: [] };

        if (node.children && node.children.length) {
            folder.title = node.title;
            node.children.forEach(child => {
                if (!child.url.startsWith('javascript:'))
                    folder.children.push({ title: child.title, url: child.url });
            });
        } else { // if not a folder, it's a shortcut
            if (!node.url.startsWith('javascript:'))
                rootFolder.children.push({ title: node.title, url: node.url });
        }

        if (folder.children.length)
            folders.push(folder);
    });

    if (rootFolder.children.length)
        folders.unshift(rootFolder);

    render(folders);
});

function render(folders) {
    const colors = ['#cc6666', '#de935f', '#f0c674', '#8abeb7', '#81a2be', '#b294bb', '#a3685a'];
    const root = document.getElementById('container');
    let i = 0;
    root.innerHTML = folders.map(folder => {
        const listItems = folder.children.map(item => {
            if (item.title === '-') return '<li class="separator">&nbsp;<li>'
            const title = trunc(item.title);
            return `<li><a href="${item.url}" title="${title.endsWith('...') ? item.title : ''}">${title}</a></li>`
        }).join('');
        i = (i >= colors.length - 1) ? 0 : (i + 1);
        return `<div class="column"><h2 class="folder-name" style="color: ${colors[i]}">${folder.title}</h1><ul>${listItems}</ul></div>`;
    }).join('');
}

function trunc(text) {
    if (text.length <= 28)
        return text;

    return text.substr(0, 30) + '...'
}