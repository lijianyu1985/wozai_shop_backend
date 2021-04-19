// mongoosejs user guide
// https://mongoosejs.com/docs/index.html
import commonServices from './common';

async function updateOrderStatusByIdAndStatus(Order, id, newStatus, opts) {
    if (!opts){
        opts = {new: true};
    }
    const order = await Order.findById(id, null, opts);
    const status = order.status.current;
    // if ((status.name === 'created' && newStatus.name === 'received')
    // || ((status.name === 'created'
    //     || status.name === 'received'
    //     || status.name === 'packed'
    //     || status.name === 'pickedup') && newStatus.name === 'canceled')
    // || (status.name === 'received' && newStatus.name === 'packed')
    // || (status.name === 'packed' && newStatus.name === 'pickedup')
    // || (status.name === 'couriercoming' && newStatus.name === 'returned')
    // || (status.name === 'returned' && newStatus.name === 'completed')){
        order.status.history.push(status);
        order.status.current = newStatus;
        const newOrder = await Order.findOneAndUpdate({_id: id}, order, opts);
        return newOrder;
    // }
}

export default Object.assign(commonServices, {
    updateOrderStatusByIdAndStatus,
});
