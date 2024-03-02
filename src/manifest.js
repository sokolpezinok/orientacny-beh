//                                                                                                       //
//                7JJ^                ..............~                                                    //
//               :77~                 ............~??                                                    //
//                :^~!777!~:          ..........~????                                                    //
//       :~~~~!7???7!~^:   :^         ........~??????                                                    //
//          :::::                     ......~????????                                                    //
//          :^!7?JJJJ?!^              ....~??????????                                                    //
//       :!JYJ?!~^^^^~7?J?~:  :^7~    ..~????????????                                                    //
//     :?J?~:            ^!7???!:     ~??????????????                                                    //
//    ~?~                                                                                                //
//    :                    ::^^^:      ##  ##   ######  ######       #####   #####  #   ##  ######  #    //
// :~!!~:    :7JJJJ?!    ^?JYYYYJ?^    ## ##   ##   ## ##   ##      ##  ##  ##  ## ##  ##  ###  ## ##    //
// !JJJJ~    !YYYYYYY^   !YYJJJJYY7    ####    ##   ## #####        ##     ##   ## #####   ##   ## ##    //
//            :~!!!^      ^!7???7^     ## ##  ##   ## ###  ##         ###  ##   ## ## ##   ##   ## ##    //
//     :!7777!:    :!?JJJ?7^          ##  ##  ##   ## ##   ##      ##   ## ##  ### ##  ##  ##  ##  ##    //
//    7YYJJJJYY?  ~YYJJJJJJY7        ###   ##  #####  ######        #####   ####   #    #   ####   ##### //
//    7YYYJJJYY7  ~YYJJJJJJY7                                                                            //
//     :~!77!~:    :!7?JJ?7^                                                                             //
//           ^7????7^                  #####    ###########   ##  ##   #  ###### ##  ##                  //
//         :JYJJJJJJY?:                ##  ##  ##       ##   ##   ### ## ##   ## ## ##                   //
//         7YJJJJJJJJY!               #####   ####    ##     ##  ## # ## ##   ## ####                    //
//         :JYJJJJJJJ?:               ##     ##     ##      ##   ## #### ##   ## ## ##                   //
//           ~7JJJJ7~                ##    ######  ####### ###  ##   ##  ######  ##   ##                 //
//                                                                                                       //
// (c) KOB Sokol Pezinok

const appName = "Orientačný beh";
const appBuildVersion = `v3.01a2`;
const appPackageName = "orienteering.app";

//======================================//
// do NOT add trailing slash at the end //
//======================================//
const appServerDomain = "members.eob.cz";
const appServerProtocol = "https";
const appServerHost = `${appServerProtocol}://${appServerDomain}`;
const appServerApi = "https://members.eob.cz/api";

module.exports = { // use CommonJS syntax for compatibility reasons with capacitor.confit.ts
    appName,
    appBuildVersion,
    appPackageName,
    appServerDomain,
    appServerProtocol,
    appServerHost,
    appServerApi,
};
