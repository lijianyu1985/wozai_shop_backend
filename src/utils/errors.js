/*

prefix    target

10        file

*/


export default  {
    unexpectedError:{
        code:'0001',
        msg:'未捕获的异常'
    },
    file:{
        saveFileFailed: {
            code: '1001',
            msg: '保存文件失败'
        },
        noFileDataInRequestBody: {
            code: '1002',
            msg: '没有在Request中找到File数据'
        },
        fileNotExists: {
            code: '1003',
            msg: '文件不存在'
        },
        getFileFailed: {
            code: '1004',
            msg: '获取文件失败'
        },
        unzipFileFailed: {
            code: '1005',
            msg: '解压文件失败'
        },
        onlyAllowZipFile: {
            code: '1006',
            msg: '请上传zip压缩文件'
        },
        restorePasswordInvalid: {
            code: '1007',
            msg: '恢复密码错误'
        }
    }
};
