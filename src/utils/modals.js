export const customModal = (text, header = "") => {
    return alert(header.length === 0 ? text : header + ": " + text);
};

export const errorModal = (text) => {
    return customModal(text, "Error");
}

export const fatalModal = (text) => {
    return customModal(text, "Fatal");
}

export const alertModal = (text) => {
    return customModal(text, "");
}