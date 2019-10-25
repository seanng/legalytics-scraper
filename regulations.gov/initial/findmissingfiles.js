const documents = require('./documents.json');
// const hello = require('./meow.json');

// const docs = documents.slice(0, 760);

const notFound = [];
const path = require('path');

console.log(path.resolve(__dirname, 'downloads'));

// for (let i = 0; i < docs.length; i++) {
//   const doc = docs[i];
//   const docId = doc['Document ID'];
//   for (let j = 0; j < hello.length; j++) {
//     const helloId = hello[j].split('_')[1].slice(0, -5);
//     if (docId === helloId) {
//       break;
//     }
//     if (j === hello.length - 1) {
//       console.log('not found at index: ', i);
//       notFound.push({
//         index: i,
//         docTitle: hello[j],
//       });
//     }
//   }
// }

// console.log('END NOT FOUND: ', notFound);
