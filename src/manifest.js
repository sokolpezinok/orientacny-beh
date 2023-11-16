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

const appName = "Orientačný beh";
const appBuildVersion = 2.14; 
const appBuildName = `v${appBuildVersion}`;

const apiSupport = 2.11;

const isSupported = (version, support) => Math.floor(version) == Math.floor(support) && support <= version;

const collaborators = [
    {name: "Vývojár", value: "Jurakin", link: "https://github.com/jurakin"},
    {name: "Dizajn", value: "Ondrej", link: "mailto:ondrej.honsch@gmail.com"},
    {name: "Vytvorené pre klub", value: "KOB Sokol Pezinok", link: "https://www.sokolpezinok.sk/"},
];

const appPackageName = "orienteering.app";
const appServerDomain = "members.eob.cz";
const appServerProtocol = "https";

module.exports = { // use CommonJS syntax for compatibility reasons with capacitor.confit.ts
    appName,
    appBuildVersion,
    appBuildName,
    apiSupport,
    isSupported,
    collaborators,
    appPackageName,
    appServerDomain,
    appServerProtocol,
};