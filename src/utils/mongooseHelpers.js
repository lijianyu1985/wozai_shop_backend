import mongoose from 'mongoose';
import Config from 'getconfig';
import OrderSchema from '../schemas/order';
import CommoditySchema from '../schemas/commodity';
import SkuSchema from '../schemas/sku';
import SystemlogSchema from '../schemas/systemLog';

const mongoConnectionConfig = Config.mongoConfig.connections[0];

let connection = null;

async function createNewConnection(){
    const conn = await mongoose.createConnection(
        mongoConnectionConfig.uri,
        mongoConnectionConfig.options,
    );
    conn.model('Order', OrderSchema);
    conn.model('Commodity', CommoditySchema);
    conn.model('Sku', SkuSchema);
    conn.model('Systemlog', SystemlogSchema);
    return conn;
};


async function connect(createNew) {
    if (createNew){
        return await createNewConnection();
    }
    if (!connection){
        connection = await createNewConnection();
    }
    return connection;
};

export default {
    connect
};
