/**
 * Checks if any entry in the provided array is expired.
 * 
 * @param {Array} entries - Array of date strings.
 * @returns {boolean} - True if any entry is expired, otherwise false.
 */
export const isEntryExpired = (entries) => {
    // Converts each entry in the provided array to a Date object
    // and sets the time to the start of the day (midnight).
    const parsedEntries = entries.map(entry => new Date(entry).setHours(0, 0, 0, 0));

    // Gets the current date with the time set to the start of the day.
    const firstEntry = Math.min(...parsedEntries);

    // Gets the current date with the time set to the start of the day.
    const currentDate = new Date().setHours(0, 0, 0, 0);

    return firstEntry < currentDate;
}

/**
 * Sorts array alphabetically by function if provided.
 * 
 * @param {Array} array 
 * @param {function} func 
 * @returns {Array}
 */
export const sortAlphabetically = (array, func = null) => array.sort((a, b) => {
    if (func !== null) {
        a = func(a);
        b = func(b);
    }

    return a < b ? -1 : a < b ? 1 : 0;
});