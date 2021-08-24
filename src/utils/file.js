import errors from '../utils/errors';
import fs from 'fs';
import Path from 'path';
import uuidv1 from 'uuid/v1';

function decodeBase64Image(dataString) {
    //var matches = JSON.parse(dataString)[0].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = {};

    // if (matches.length !== 3) {
    //     return new Error('Invalid input string');
    // }

    response.type = 'data:image/jpeg';
    response.data = new Buffer(JSON.parse(dataString)[0], 'base64');

    return response;
}

export function saveTolocal(base64, parentPath, fileName) {
    const storedFilename = uuidv1() + '_' + fileName;
    const currentFullYear = new Date().getFullYear() + '';
    const currentMonth = new Date().getMonth() + 1 + '';
    const folderSubYear = Path.join(
        __dirname,
        '../../public/images/' + parentPath + '/' + currentFullYear + '/'
    );
    const folder = Path.join(folderSubYear, currentMonth + '/');
    fs.existsSync(folderSubYear) || fs.mkdirSync(folderSubYear);
    fs.existsSync(folder) || fs.mkdirSync(folder);
    const path = Path.join(folder, storedFilename);

    const imageBuffer = decodeBase64Image(base64);

    try {
        fs.writeFileSync(path, imageBuffer.data);
        return {
            result: true,
            filePath: '/images/' + parentPath + '/' + currentFullYear + '/' + currentMonth + '/' + storedFilename
        };
    }
    catch (err) {
        return {
            result: false,
            code: errors.file.saveFileFailed.code,
            msg: err.message
        };
    }
}

export default {
    saveTolocal
};
