/*

prefix    target
00        common
10        file
11        client


*/


export default {
    unexpectedError: {
        code: '0001',
        msg: '未捕获的异常'
    },
    common: {
        updateQueryCantBeNull: {
            code: '0002',
            msg: '更新条件不能为空'
        }
    },
    file: {
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
    },
    admin:{
        adminDoesntExists: {
            code: '0101',
            msg: '账户不存在'
        },
        passwordNotMatch: {
            code: '0102',
            msg: '密码不匹配'
        },
        haveNoEmail: {
            code: '0103',
            msg: '用户没有email地址'
        },
        currentPasswordNotMatch: {
            code: '0104',
            msg: '当前密码不匹配'
        },
        adminAlreadyExists: {
            code: '0105',
            msg: '账户已存在'
        },
        adminArchived: {
            code: '0106',
            msg: '账户已归档'
        },
        oldPasswordAndNewPasswordShouldNtSame: {
            code: '0107',
            msg: '新旧密码不能相同'
        },
        tokenInvalid: {
            code: '0108',
            msg: 'Token无效'
        }
    },
    client: {
        clientAlreadyExists: {
            code: '1101',
            msg: '账户已经存在'
        }
    }
};
