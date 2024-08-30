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
const appBuildVersion = `v3.02a0`;
const appPackageName = "orienteering.app";

//======================================//
// do NOT add trailing slash at the end //
//======================================//
const apiDomain = "members.eob.cz";
const apiVersion = 1;
const apiServer = `https://members.eob.cz/api/debug/${apiVersion}`;

module.exports = {
  // use CommonJS syntax for compatibility reasons with capacitor.config.ts
  appName,
  appBuildVersion,
  appPackageName,
  apiDomain,
  apiVersion,
  apiServer,
};
