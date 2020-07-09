import errors from '../utils/errors';
import crypto from 'crypto';
import commonService from '../services/common';
import {signJwt, decodeToken, verifyToken as verifyTokenUtil} from '../utils/auth/auth';

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
        admin
    };
}

async function signup(request, h){

}
async function wxSignin(request, h){
    const {code} = request.payload;
    return {
        success: true,
        code,
        sessionId: 'sessionId',
        data: {}
    };
}
async function wxSignup(request, h){

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

export default {
    signin,
    verifyToken,
    changePassword,
    wxSignin
};
