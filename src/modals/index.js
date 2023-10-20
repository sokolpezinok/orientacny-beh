export const CustomModal = (text, header = "") => {
    return alert(header.length === 0 ? text : header + ": " + text);
};

export const ErrorModal = (text) => {
    return CustomModal(text, "Error");
}

export const FatalModal = (text) => {
    return CustomModal(text, "Fatal");
}

export const AlertModal = (text) => {
    return CustomModal(text, "");
}