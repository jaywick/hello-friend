const trunc = (text) => {
    if (text.length <= options.MAX_NAME_LENGTH - 2) {
        return text;
    }

    return text.substring(0, options.MAX_NAME_LENGTH) + "…";
};
