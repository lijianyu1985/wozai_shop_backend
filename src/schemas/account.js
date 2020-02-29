module.exports = function (mongoose) {
    const modelName = 'account';
    const Types = mongoose.Schema.Types;

    const Schema = new mongoose.Schema(
        {
            method: {
                type: Types.String,
                enum: ['POST', 'PUT', 'DELETE', 'GET', null],
                allowNull: true,
                default: null
            },
            action: {
                type: Types.String,
                allowNull: true,
                default: null
            },
            endpoint: {
                type: Types.String,
                allowNull: true,
                default: null
            },
            user: {
                type: Types.ObjectId,
                allowNull: true,
                default: null
            },
            collectionName: {
                type: Types.String,
                allowNull: true,
                default: null
            },
            childCollectionName: {
                type: Types.String,
                allowNull: true,
                default: null
            },
            associationType: {
                type: Types.String,
                enum: ['ONE_MANY', 'MANY_MANY', '_MANY', null],
                allowNull: true,
                default: null
            },
            documents: {
                type: [Types.ObjectId],
                allowNull: true,
                default: null
            },
            payload: {
                type: Types.Object,
                allowNull: true,
                default: null
            },
            params: {
                type: Types.Object,
                allowNull: true,
                default: null
            },
            result: {
                type: Types.Object,
                allowNull: true,
                default: null
            },
            statusCode: {
                type: Types.Number,
                allowNull: true,
                default: null
            },
            responseMessage: {
                type: Types.String,
                allowNull: true,
                default: null
            },
            isError: {
                type: Types.Boolean,
                default: false,
                required: true
            },
            ipAddress: {
                type: Types.String,
                allowNull: true,
                default: null
            },
            notes: {
                type: Types.String,
                allowNull: true,
                default: null
            }
        },
        {collection: modelName}
    );

    Schema.statics = {
        collectionName: modelName,
        routeOptions: {
            allowUpdate: false,
            allowDelete: false
        }
    };
    return Schema;
}
;
