function header(text: string) {
    return function (target, key) {
        console.log(text);
    }
}