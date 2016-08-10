function decorate(handle, ...args) {
    return handle(...arguments, []);
}

function handleDescriptor(target, key, descriptor) {
    console.log(target);
    console.log(key);
    console.log(descriptor);
    descriptor.writable = true;
    return descriptor;
}


function serializable(...args) {
    return decorate(handleDescriptor, args);
}