import fs from 'fs';
import Path from 'path';
import uuidv1 from 'uuid/v1';
import Joi from '@hapi/joi';
import Jimp from 'jimp';
import errors from '../utils/errors';
import mammoth from 'mammoth';

const saveFile = async (request, subFoler) => {
    try {
        const data = request.payload;
        if (data.file) {
            const name = data.file.hapi.filename;
            const storedFilename = uuidv1() + '_' + name;
            const currentFullYear = (new Date()).getFullYear() + '';
            const currentMonth = ((new Date()).getMonth() + 1) + '';
            const folderSubYear = Path.join(__dirname, '../../public/' + subFoler + '/' + currentFullYear + '/');
            const folder = Path.join(folderSubYear, currentMonth + '/');
            fs.existsSync(folderSubYear) || fs.mkdirSync(folderSubYear);
            fs.existsSync(folder) || fs.mkdirSync(folder);
            const path = Path.join(folder, storedFilename);
            const file = fs.createWriteStream(path);

            return await new Promise((resolve, reject) => {
                file.on('error', (err) => {
                    reject({
                        code: errors.file.saveFileFailed.code,
                        msg: err.message
                    });
                });

                data.file.on('end', (err) => {
                    if (err) {
                        reject({
                            code: errors.file.saveFileFailed.code,
                            msg: err.message
                        });
                    }
                    const ret = {
                        filePath: '/' + subFoler + '/' + currentFullYear + '/' + currentMonth + '/' + storedFilename
                    };
                    resolve(ret);
                });
                data.file.pipe(file);
            });
        }
        return {
            error: errors.file.noFileDataInRequestBody
        };
    }
    catch (err) {
        return {
            error: {
                code: err.code || errors.file.saveFileFailed.code,
                msg: err.message || err.msg || errors.file.saveFileFailed.code
            }
        };
    }
};

const saveValue = async (value, subFoler, fileName) => {
    try {
        if (value) {
            const storedFilename = uuidv1() + '_' + fileName;
            const currentFullYear = (new Date()).getFullYear() + '';
            const currentMonth = ((new Date()).getMonth() + 1) + '';
            const folderSubYear = Path.join(__dirname, '../../public/' + subFoler + '/' + currentFullYear + '/');
            const folder = Path.join(folderSubYear, currentMonth + '/');
            fs.existsSync(folderSubYear) || fs.mkdirSync(folderSubYear);
            fs.existsSync(folder) || fs.mkdirSync(folder);
            const path = Path.join(folder, storedFilename);

            return await new Promise((resolve, reject) => {
                fs.writeFile(path, value, 'utf8', (err) => {
                    if (err) {
                        reject({
                            code: err.code,
                            msg: err.message
                        });
                    }
                    const ret = {
                        filePath: '/' + subFoler + '/' + currentFullYear + '/' + currentMonth + '/' + storedFilename
                    };
                    resolve(ret);
                });
            });
        }
        return {
            error: errors.file.noFileDataInRequestBody
        };
    }
    catch (err) {
        return {
            error: {
                code: err.code || errors.file.saveFileFailed.code,
                msg: err.message || err.msg || errors.file.saveFileFailed.code
            }
        };
    }
};

export default [
    {
        method: 'POST',
        path: '/Images',
        handler: async function (request, h) {
            return await saveFile(request, 'images');
        },
        options: {
            auth: false,
            description: 'Upload Image',
            notes: ['文件大小不能超过3M', '只能上传一个文件，文件名必须是file'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            tags: ['api', 'file'],
            validate: {
                payload: {
                    file: Joi.any()
                        .meta({swaggerType: 'file'})
                        .description('json file')
                }
            },
            payload: {
                multipart: true,
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 3 * 1024 * 1024
            }
        }
    },
    {
        method: 'GET',
        path: '/Images/{param*}',
        handler: async function (request, h) {
            try {
                const filename = Path.posix.basename(decodeURIComponent(request.path));
                if (!filename) {
                    return errors.file.fileNotExists;
                }

                const mimes = request.server.mime._byExtension;
                const mimeType = mimes[Path.extname(filename).slice(1)].type;
                const imageOptions = {
                    width: parseInt(request.query.width) || null,
                    height: parseInt(request.query.height) || null
                };
                const func = request.query.func || 'scaleToFit';
                const imagePath = Path.join('./public/images', decodeURIComponent(request.params.param));

                if (imageOptions.width && imageOptions.height) {
                    const imageData = await new Promise((resolve, reject) => {
                        Jimp.read(imagePath, (err, lenna) => {
                            if (err) {
                                return reject(
                                    err.code === 'ENOENT'
                                        ? errors.file.fileNotExists
                                        : {
                                            code: errors.file.getFileFailed.code,
                                            msg: err.message || errors.file.getFileFailed.msg
                                        }
                                );
                            }

                            let operatorObj = lenna;
                            if (
                                func === 'resize' &&
                                imageOptions.width &&
                                imageOptions.height
                            ) {
                                operatorObj = operatorObj.resize(
                                    imageOptions.width,
                                    imageOptions.height
                                );
                            }
                            if (
                                func === 'scaleToFit' &&
                                imageOptions.width &&
                                imageOptions.height
                            ) {
                                operatorObj = operatorObj.scaleToFit(
                                    imageOptions.width,
                                    imageOptions.height
                                );
                            }
                            operatorObj.getBuffer(mimeType, (err, data) => {
                                if (err) {
                                    return reject(
                                        err.code === 'ENOENT'
                                            ? errors.file.fileNotExists
                                            : {
                                                code: errors.file.getFileFailed.code,
                                                msg: err.message || errors.file.getFileFailed.msg
                                            }
                                    );
                                }
                                return resolve(data);
                            });
                        });
                    });
                    return h.response(imageData)
                        .type(mimeType)
                        .header('Content-Type', mimeType);
                }

                const imageData = await new Promise((resolve, reject) => {
                    return fs.readFile(imagePath, (err, payload) => {
                        if (err) {
                            return reject(
                                err.code === 'ENOENT'
                                    ? errors.file.fileNotExists
                                    : {
                                        code: errors.file.getFileFailed.code,
                                        msg: err.message || errors.file.getFileFailed.msg
                                    }
                            );
                        }
                        return resolve(payload);
                    });
                });
                return h.response(imageData)
                    .type(mimeType)
                    .header('Content-Type', mimeType);
            }
            catch (err) {
                return {
                    error: {
                        code: err.code || errors.file.getFileFailed.code,
                        msg: err.message || err.msg || errors.file.getFileFailed.code
                    }
                };
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/Videos',
        handler: async function (request, h) {
            return await saveFile(request, 'videos');
        },
        options: {
            auth: false,
            description: 'Upload Video',
            notes: ['文件大小不能超过10M', '只能上传一个文件，文件名必须是file'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            tags: ['api', 'file'],
            validate: {
                payload: {
                    file: Joi.any()
                        .meta({swaggerType: 'file'})
                        .description('json file')
                }
            },
            payload: {
                multipart: true,
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 30 * 1024 * 1024
            }
        }
    },
    {
        method: 'GET',
        path: '/Videos/{param*}',
        handler: function (request, h) {
            try {
                const filename = Path.posix.basename(decodeURIComponent(request.path));
                if (!filename) {
                    return errors.file.fileNotExists;
                }

                const videoPath = Path.join('./public/videos', decodeURIComponent(request.params.param));

                const stat = fs.statSync(videoPath);
                const fileSize = stat.size;
                const range = request.headers.range;
                if (range) {
                    const parts = range.replace(/bytes=/, '').split('-');
                    const start = parseInt(parts[0], 10);
                    const end = parts[1]
                        ? parseInt(parts[1], 10)
                        : fileSize - 1;

                    const chunksize = (end - start) + 1;
                    const file = fs.createReadStream(videoPath, {start, end});

                    return h.response(file)
                        .code(206)
                        .type('video/mp4')
                        .header('Content-Range', `bytes ${start}-${end}/${fileSize}`)
                        .header('Accept-Range', 'bytes')
                        .header('Content-Length', chunksize)
                        .header('Content-Type', 'video/mp4');
                }

                return h.response(fs.createReadStream(videoPath))
                    .code(200)
                    .type('video/mp4')
                    .header('Content-Length', fileSize)
                    .header('Content-Type', 'video/mp4');
            }
            catch (err) {
                return {
                    error: err.code === 'ENOENT'
                        ? errors.file.fileNotExists
                        : {
                            code: errors.file.getFileFailed.code,
                            msg: err.message || errors.file.getFileFailed.msg
                        }
                };
            }

        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/Docs',
        handler: async function (request, h) {
            const fileResultDoc = await saveFile(request, 'docs');
            const docPath = Path.join('./public', fileResultDoc.filePath);
            const html = await mammoth.convertToHtml({path: docPath}, {
                convertImage: mammoth.images.imgElement((image) => {
                    return image.read('base64').then((imageBuffer) => {
                        return {
                            src: 'data:' + image.contentType + ';base64,' + imageBuffer
                        };
                    });
                })
            });
            let fileName = request.payload.file && request.payload.file.hapi.filename;
            fileName = fileName ? fileName.replace('.docx', '.html').replace('.doc', '.html') : '';
            const fileResultHtml = await saveValue('<meta charset="UTF-8">' + html.value, 'htmls', fileName);
            return {
                fileResultDoc,
                fileResultHtml,
                meta:'<meta charset="UTF-8">'
            };
        },
        options: {
            auth: false,
            description: 'Upload File',
            notes: ['文件大小不能超过3M', '只能上传一个文件，文件名必须是file'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            tags: ['api', 'file'],
            validate: {
                payload: {
                    file: Joi.any()
                        .meta({swaggerType: 'file'})
                        .description('json file')
                }
            },
            payload: {
                multipart: true,
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 3 * 1024 * 1024
            }
        }
    },
    {
        method: 'GET',
        path: '/Docs/{param*}',
        handler: async function (request, h) {
            try {
                const filename = Path.posix.basename(decodeURIComponent(request.path));
                if (!filename) {
                    return errors.file.fileNotExists;
                }

                const mimes = request.server.mime._byExtension;
                const mimeType = mimes[Path.extname(filename).slice(1)].type;
                const docPath = Path.join('./public/docs', decodeURIComponent(request.params.param));
                const imageData = await new Promise((resolve, reject) => {
                    return fs.readFile(docPath, (err, payload) => {
                        if (err) {
                            return reject(
                                err.code === 'ENOENT'
                                    ? errors.file.fileNotExists
                                    : {
                                        code: errors.file.getFileFailed.code,
                                        msg: err.message || errors.file.getFileFailed.msg
                                    }
                            );
                        }
                        return resolve(payload);
                    });
                });
                return h.response(imageData)
                    .type(mimeType)
                    .header('Content-Type', mimeType);
            }
            catch (err) {
                return {
                    error: {
                        code: err.code || errors.file.getFileFailed.code,
                        msg: err.message || err.msg || errors.file.getFileFailed.code
                    }
                };
            }
        },
        config: {
            auth: false
        }
    }
];
