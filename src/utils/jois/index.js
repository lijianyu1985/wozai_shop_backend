import Joi from '@hapi/joi';

const generateJois = function () {
    const jois = [];
    jois.CommonJoi = {
        id: Joi.string().length(24).alphanum().required(),
        optionalId: Joi.string().length(24).alphanum().allow('').allow(null),
        password: Joi.string().min(8).max(20).regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!?.+=@#$%^&*])(?=.{8,20}$)/).required().trim(),
        optionalPassword: Joi.string().min(8).max(20).regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!?.+=@#$%^&*])(?=.{8,20}$)/).trim(),
        email: Joi.string().regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'email')
    };
    return jois;
};

export default generateJois();
