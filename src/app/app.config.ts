const serviceHost = 'http://localhost:1501';
// let serviceHost = 'http://localhost:1500';
// if (window['require']) {
//     const require = window['require'];
//     const fs = require('fs');
//     const path = require('path');
//     const process = window['process'];

//     const appConfigPath = path.join(process.env.USERPROFILE, '.as', 'config.json');

//     if (fs.existsSync(appConfigPath)) {
//         const configJSON = require(appConfigPath);
//         if (configJSON && configJSON['web-server']) {
//             serviceHost = configJSON['web-server'];
//         }
//     } else {
//         fs.writeFile(appConfigPath, JSON.stringify({
//             'web-server': serviceHost
//         }, null, 4), function (error) {
//             if (error) {
//                 throw error;
//             }
//         });
//     }
// }

export const API_CONFIG = {
    DR: serviceHost
};

