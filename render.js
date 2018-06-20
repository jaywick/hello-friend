const render = columns => {
    const colors = options.COLOR_THEME;
    const root = document.getElementById('container');

    let colourIndex = 0;

    root.innerHTML = columns
        .filter(column => column.children.length)
        .map(column => {
            const listItems = column
                .children.map(bookmark => {
                    const title = bookmark.path
                        .slice(1) // skip column name
                        .concat(bookmark.title) // add bookmark name
                        .join('/'); // join as path

                    if (bookmark.title === '-') {
                        // force hyphen
                        return '<li class="separator">&nbsp;</li>';
                    }

                    return (
                        `<li>
                    <a href="${bookmark.url}" title="${title.endsWith('...') ? bookmark.title : ''}">
                        ${title}
                    </a>
                </li>`
                    );
                }).join('');

            colourIndex = (colourIndex >= colors.length - 1) ? 0 : (colourIndex + 1);
            return (
                `<div class="column">
                <h2 class="folder-name" style="color: ${colors[colourIndex]}">
                    ${column.title}
                </h1>
                <ul>${listItems}</ul>
            </div>`
            );
        }).join('');

    document.getElementById('welcome').innerHTML = options.TITLE;
};
