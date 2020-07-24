import JWT from 'jsonwebtoken';
import Config from 'getconfig';
import DefaultJwt from '../../plugins/default-jwt';
import crypto from 'crypto';

const authConfig = Config.authConfig;

// eslint-disable-next-line require-await
export async function configAuth(server) {
    const validate = authConfig.enabled ? validateAdmin : (decoded, request) => {
        return {isValid: true};
    };
    if (!authConfig.enabled){
        await server.register([
            DefaultJwt
        ]);
    }
    await server.register([
        require('hapi-auth-jwt2')
    ]);
    server.state('token', authConfig.cookieOptions);
    const strategyOptions =  {
        key: authConfig.secretKey, // Never Share your secret key
        validate, // validate function defined above
        verifyOptions: {algorithms: ['HS256']}, // pick a strong algorithm
        errorFunc: function (errorContext) {
            const result = errorContext;
            if (errorContext.message && typeof errorContext.message === 'object' && errorContext.message.message === 'forbidden') {
                result.message = 'Forbidden';
                result.scheme = 'Access control';
                //https://github.com/dwyl/hapi-auth-jwt2/blob/df6f5b5f2073a5a9c197cd3e171285e4fc043d00/README.md
                //this is a Boom function for response
                result.errorType = 'forbidden';
            }
            return result;
        }
    };

    server.auth.strategy('jwt', 'jwt', strategyOptions);

    server.auth.default('jwt');
}

export async function validateAdmin(decoded, request) {
    const {id} = decoded;
    const currentAdmin = await request.mongo.models.Admin.findById(id);
    if (!currentAdmin){
        return {isValid: false};
    }
    if (currentAdmin.archived){
        return {isValid: false};
    }
    if (decoded.authorizationFingerprint !== generateAuthorizationFingerprint(currentAdmin)){
        return {isValid: false};
    }
    return {isValid: true};
}

function generateAuthorizationFingerprint(staff){
    return crypto.createHash('md5').update(staff.fingerPrint + '|' + staff.hashedPassword + '|' + staff.role + '|' + staff.archived + '|' + staff.username).digest('hex');
}

export async function signJwt(staff) {
    const token = await JWT.sign(
        {
            username: staff.username,
            name: staff.name,
            role: staff.role,
            scope: staff.scope,
            id: staff._id,
            authorizationFingerprint: generateAuthorizationFingerprint(staff)
        },
        authConfig.secretKey,
        authConfig.signOptions
    );
    return token;
}

export function decodeToken(token) {
    try {
        return JWT.verify(token, authConfig.secretKey);
    }
    catch (err) {
        return false;
    }
}

export async function verifyToken(token, request) {
    try {
        const decoded = decodeToken(token);
        const currentAdmin = await request.mongo.models.Admin.findById(decoded.id);
        if ( generateAuthorizationFingerprint(currentAdmin) === decoded.authorizationFingerprint){
            return !!decoded;
        }
        return false;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
