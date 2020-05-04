import errors from '../utils/errors';
import crypto from 'crypto';
import commonService from '../services/common';
import {signJwt, decodeToken, verifyToken as verifyTokenUtil} from '../utils/auth/auth';

async function currentUser(request, h){
    const id = request.auth && request.auth.credentials && request.auth.credentials.id;
    const admin = await commonService.getById(request.mongo.models.Admin, id, '_id username name role scope');
    if (!admin) {
        return {
            error: errors.admin.adminDoesntExists
        };
    }
    if (admin.archived) {
        return {
            error: errors.admin.adminArchived
        };
    }
    return {
        success: true,
        admin
    };
}

async function signin(request, h) {
    const {username, password} = request.payload;
    const admin = await commonService.getByQuery(request.mongo.models.Admin, {username});
    if (!admin) {
        return {
            error: errors.admin.adminDoesntExists
        };
    }
    if (admin.archived) {
        return {
            error: errors.admin.adminArchived
        };
    }
    /* if (crypto.createHash('md5').update(password).digest('hex') !== admin.hashedPassword) {
        return {
            error: errors.admin.passwordNotMatch
        };
    } */
    const token = await signJwt(admin);
    return {
        success: true,
        token,
        currentAuthority: admin.role
    };
}

async function verifyToken(request) {
    const {token} = request.payload;
    const verified = await verifyTokenUtil(token, request);
    if (!verified) {
        return {
            error: errors.admin.tokenInvalid
        };
    }
    const decoded = await decodeToken(token);
    const {Admin} = request.mongo.models;
    const admin = await commonService.getById(Admin, decoded.id);
    if (!admin) {
        return {
            error: errors.admin.tokenInvalid
        };
    }
    if (admin) {
        return {
            success: true,
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                role: admin.role
            }
        };
    }
    return {
        error: errors.admin.tokenInvalid
    };
}

async function changeRole(request, h) {
    const {role} = request.payload;
    const {id} = request.query;
    const currentAdmin = await commonService.getById(request.mongo.models.Admin, id);
    let updatedAdmin = await commonService.updateById(request.mongo.models.Admin, id, {role});
    if (currentAdmin.role !== updatedAdmin.role) {
        updatedAdmin = await commonService.updateById(request.mongo.models.Admin, id, {$inc: {fingerPrint: 1}});
    }
    return updatedAdmin;
}

async function resetPassword(request, h) {
    const {password} = request.payload;
    const {id} = request.query;
    await commonService.updateById(request.mongo.models.Admin, id, {
        hashedPassword: crypto.createHash('md5').update(password).digest('hex')
    });
    const updateAdmin = await commonService.updateById(request.mongo.models.Admin, id, {$inc: {fingerPrint: 1}});
    if (!updateAdmin) {
        return {
            error: errors.admin.adminDoesntExists
        };
    }
    return updateAdmin;
}

async function defaultPassword(request, h) {
    const {id} = request.payload;
    await commonService.updateById(request.mongo.models.Admin, id, {
        hashedPassword: crypto.createHash('md5').update('12345678').digest('hex')
    });
    const updateAdmin = await commonService.updateById(request.mongo.models.Admin, id, {$inc: {fingerPrint: 1}});
    if (!updateAdmin) {
        return {
            error: errors.admin.adminDoesntExists
        };
    }
    return {
        success: true,
        data: updateAdmin
    };
}

async function changePassword(request, h) {
    const {oldPassword, newPassword} = request.payload;
    if (oldPassword === newPassword) {
        return {
            error: errors.admin.oldPasswordAndNewPasswordShouldNtSame
        };
    }
    const id = request.auth && request.auth.credentials && request.auth.credentials.id;
    const admin = await commonService.getById(request.mongo.models.Admin, id);
    if (crypto.createHash('md5').update(oldPassword).digest('hex') !== admin.hashedPassword) {
        return {
            error: errors.admin.currentPasswordNotMatch
        };
    }
    await commonService.updateById(request.mongo.models.Admin, id, {
        hashedPassword: crypto.createHash('md5').update(newPassword).digest('hex')
    });
    const updatedAdmin = await commonService.updateById(request.mongo.models.Admin, id, {$inc: {fingerPrint: 1}});
    return {
        success: true,
        data: updatedAdmin
    };
}

async function archive(request, h) {
    const {ids} = request.payload;
    await commonService.updateByQuery(request.mongo.models.Admin, {_id: {$in: ids}, archived: false}, {$inc: {fingerPrint: 1}});
    return  {
        success: true,
        data: await commonService.toggleArchive(request.mongo.models.Admin, ids, true)
    };
}

async function unarchive(request, h) {
    const {ids} = request.payload;
    await commonService.updateByQuery(request.mongo.models.Admin, {_id: {$in: ids}, archived: true}, {$inc: {fingerPrint: 1}});
    return  {
        success: true,
        data: await commonService.toggleArchive(request.mongo.models.Admin, ids, false)
    };
}

export default {
    signin,
    currentUser,
    verifyToken,
    changeRole,
    resetPassword,
    defaultPassword,
    changePassword,
    archive,
    unarchive
};
