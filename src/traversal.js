const obj = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
        e: 3,
    },
}

function *objectPaths(obj, current = '') {
    for (const [key, value] of Object.entries(obj)) {
        const path = current ? `${current}.${key}` : key;

        if (typeof value === 'object') {
            yield *objectPaths(value, path);
        } else {
            yield path;
        }
    }
}

const iter = objectPaths(obj);

for (const path of iter) {
    console.log(path);
}