const path = require('path');

function getPageIndex(filePath) {
    return new Promise(async (res) => {
        const result = [];
        const files = await readDir(filePath);
        for (const v of files) {
            const fileDir = path.join(filePath, v);
            const stats = await stat(fileDir);
            if (stats.isDirectory()) {
                const e = await getPageIndex(fileDir);
                result.push(...e)
            } else if (stats.isFile() && v === 'page-index.ts') {
                result.push(fileDir)
            }
        }
        res(result);
    });
}

function readDir(path) {
    return new Promise((res, rej) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                rej();
            } else {
                res(files)
            }
        });
    })
}

function stat(path) {
    return new Promise((res, rej) => {
        fs.stat(path, (err, files) => {
            if (err) {
                rej();
            } else {
                res(files)
            }
        });
    })
}

const appSrc = path.resolve(__dirname, '/src');
const appNodeModules = path.resolve(__dirname, 'node_modules');

module.exports = {
    mode: 'development',
    resolve: {
        modules: ['node_modules', appNodeModules],
        extensions: [
            '.mjs',
            '.web.ts',
            '.ts',
            '.web.tsx',
            '.tsx',
            '.web.js',
            '.js',
            '.json',
            '.web.jsx',
            '.jsx'
        ],
        alias: {
            '@src': appSrc
        },
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.ts$/,
                        enforce: 'pre',
                        use: [
                            require.resolve('babel-loader'),
                            {
                                loader: require.resolve('ts-loader'),
                                options: {
                                    transpileOnly: true,
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
};