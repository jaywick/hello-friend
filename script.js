const columns = [];

chrome.bookmarks.getTree(items => {
    const bookmarksBar = items[0].children.find(x => options.ROOT_FOLDER.test(x.title));

    if (!bookmarksBar) {
        console.error(`Was expecting a folder called '${options.ROOT_FOLDER}'`);
    }

    const rootBookmarks = bookmarksBar.children
        .filter(node => !node.children);

    const rootFolders = bookmarksBar.children
        .filter(node => !!node.children);

    const rootColumn = {
        title: '/',
        children: [],
    };

    rootBookmarks
        .forEach(node => addBookmark(rootColumn, node));

    columns.push(rootColumn);

    rootFolders
        .forEach(node => {
            const column = {
                title: node.title,
                children: [],
            };

            visit(column, node);

            columns.push(column);
        });

    render(columns);
});

const visit = (column, node, path = []) => {
    if (node.children) {
        node.children.forEach(x => visit(column, x, [...path, node.title]));
        return;
    }

    addBookmark(column, node, path);
};

const addBookmark = (column, node, path = []) => {
    if (!node.url || node.url.startsWith('javascript:')) {
        // ignore bookmarklets
        return;
    }

    const isSeparator = node.title === '-' || node.type === 'separator';

    column.children.push({
        title: node.title,
        url: node.url,
        path: path,
        isSeparator,
    });
};

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.background = options.BACKGROUND;
    document.getElementById('welcome').style.color = options.TITLE_COLOR;
});

// notify firefox users to set their home page
if (window.browser) {
    window.browser.runtime.getBrowserInfo()
        .then(browser => {
            if (browser.name === 'Firefox') {
                console.log(`Hello, friend. On ${browser.name} you can make this your home page by setting the following URL in your home page preferences:`);
                console.log(window.location.href)
            }
        });
}
