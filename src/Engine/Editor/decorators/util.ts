// const {
//     defineProperty, getOwnPropertyDescriptor,
//     getOwnPropertyNames, getOwnPropertySymbols
// } = Object;

// function isDescriptor(desc) {
//     if (!desc || !desc.hasOwnProperty) {
//         return false;
//     }

//     const keys = ['value', 'initializer', 'get', 'set'];

//     for (let i = 0, l = keys.length; i < l; i++) {
//         if (desc.hasOwnProperty(keys[i])) {
//             return true;
//         }
//     }

//     return false;
// }

// function decorate(handleDescriptor, entryArgs) {
//     if (isDescriptor(entryArgs[entryArgs.length - 1])) {
//         return handleDescriptor(...entryArgs, []);
//     } else {
//         return function () {
//             return handleDescriptor(...arguments, entryArgs);
//         };
//     }
// }

// const getOwnKeys = getOwnPropertySymbols
//     ? function (object) {
//         return getOwnPropertyNames(object)
//             // .concat(getOwnPropertySymbols(object));
//     }
//     : getOwnPropertyNames;


// function getOwnPropertyDescriptors(obj) {
//     const descs = {};

//     getOwnKeys(obj).forEach(
//         key => (descs[key] = getOwnPropertyDescriptor(obj, key))
//     );

//     return descs;
// }

// function createDefaultSetter(key) {
//     return function set(newValue) {
//         Object.defineProperty(this, key, {
//             configurable: true,
//             writable: true,
//             // IS enumerable when reassigned by the outside word
//             enumerable: true,
//             value: newValue
//         });

//         return newValue;
//     };
// }