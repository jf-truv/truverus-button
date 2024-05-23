// const { logResults } = require('./mysqlServer.cjs');
// logResults()
//     .then((results) => {
//         console.log('Final Results:', results);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });


//let logResults;


// Dynamically import the CommonJS module
// Promise.resolve().then(function () { return import('./mysqlServer.cjs'); }).then(function (module) {
//     // Extract the function from the module
//     const logResults = module.logResults;

//     logResults()
//     .then((results) => {
//         console.log('Final Results:', results);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
// }).catch(function (error) {
//     console.error('Error importing module:', error);
// });

// Usage of logResults should be within the then callback to ensure it's available




// import { logResults } from './mysqlServer.js';

// logResults()
//   .then((results) => {
//     //console.log('Final Results:', results);

//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });



// import { logResults } from './mysqlServer.js';

// const processResults = async () => {
//   try {
//     const results = await logResults();
//     // Process the results here if needed
//     return results;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error; // Rethrow the error to propagate it
//   }
// };

// export default processResults;

// import { logResults } from './mysqlServer.js';

// const processResults = () => {
//     return logResults()
//       .then((results) => {
//         // Process the results here if needed
//         return results;
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         throw error; // Rethrow the error to propagate it
//       });
// };


// export default processResults



// const processResults = async () => {
//   try {
//         const results = await logResults();
//         return results;
//     } catch (error) {
//         console.error('Error:', error);
//         throw error; // Rethrow the error to propagate it
//     }
// };

// export default processResults;


