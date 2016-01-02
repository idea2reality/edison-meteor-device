global.Promise = require('bluebird');

function delayPromise(delay, value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(value);
            resolve(value);
        }, delay);
    });
}


// Promise.each([
//     delayPromise(500, 1),
//     delayPromise(100, 2)
// ], function() { });

delayPromise(1000, 1)
    .then((value) => {
        console.log('ya', value);
        return delayPromise(1500, 2);
    })
    .then((value) => {
        console.log('ya', value);
        return delayPromise(100, 3);
    });
