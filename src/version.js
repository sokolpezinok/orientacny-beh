// Example:
//    2.1 ← minor version (compatible)
//    ↑
//    major version (non compatible)
//
// If `apiSupport = 1.2`:
//  - is compatible with `apiVersion`:
//      - `1.2`, `1.3`
//  - is not compatible with `apiVersion`:
//      - `1.1`, `1`, `2`

export const appBuildName = "v2.1-beta";
export const appBuildVersion = 2.1;

export const apiSupport = 2.1;

export const isSupported = (version, support) => Math.floor(version) == Math.floor(support) && support <= version;

export const collaborators = [
    {name: "Vývojár", value: "Jurakin", link: "https://github.com/jurakin"},
    {name: "Dizajn", value: "Ondrej"},
    {name: "Vytvorené pre klub", value: "KOB Sokol Pezinok", link: "https://www.sokolpezinok.sk/"},
];