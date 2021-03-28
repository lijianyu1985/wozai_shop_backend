/*

prefix    target
00        common
10        file
11        client
12        commodity
13        order

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
        },
        wxCode2SessionException: {
            code: '1102',
            msg: '微信session获取异常'
        },
        wxLoginFail: {
            code: '1103',
            msg: '微信登录失败'
        },
        tokenInvalid: {
            code: '1104',
            msg: 'Token验证失败'
        }
    },
    commodity:{
        codeAlreadyUsed:{
            code: '1201',
            msg: '商品编码已经被使用'
        },
        notExisting:{
            code: '1202',
            msg: '商品不存在'
        },
        statusNotAllowEditing:{
            code: '1203',
            msg: '当前状态不允许编辑'
        },
        statusNotAllowPublish:{
            code: '1204',
            msg: '当前状态不允许上线'
        },
        statusNotAllowWithdraw:{
            code: '1205',
            msg: '当前状态不允许下线'
        },
        statusNotAllowDiscard:{
            code: '1206',
            msg: '当前状态不允许废弃'
        }
    },
    category: {
        cantDeleteWhenHasReference:{
            code: '1301',
            msg: '存在引用，不可以被删除'
        }
    },
    order:{
        skuAmountNotEnough:{
            code: '1301',
            msg: '当前产品库存不够'
        },
        noOrderBeFound:{
            code: '1302',
            msg: '没有找到订单'
        },
        noCreatedOrderBeFound:{
            code: '1303',
            msg: '没有已创建订单'
        },
        wxPrePayException:{
            code: '1304',
            msg: '微信预支付异常'
        }
    }
};
