import lodash from 'lodash';

export function generateCode(){
    return ('' + Math.floor(Math.random() * 10000)).padStart(4,'0');
}

export function  getDiffDays(start, end) {
    if (!start || !end) {
        return 0;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((start.getTime() - end.getTime()) / (oneDay)));
    return diffDays;
}

export function buildMemberCreditHistoryFromOrder(order){
    let title;
    lodash.forEach(order.productItems, (pi) => {
        title = '[' + ((pi.phySuitcase && pi.phySuitcase.name) || pi.virSuitcase.name) + '],';
    });
    if (order.suppliesItems && order.suppliesItems.length){
        title = '旅行用品';
    }
    else {
        title = title.substring(0,title.length - 1);
    }
    return {
        orderId: order._id,
        start: order.tripStartAt,
        end: order.tripEndAt,
        productPhoto: order.productItems[0].virSuitcase.photos[0],
        productTitle: title
    };
}

export function isJSON(str) {
    if (typeof str === 'string') {
        try {
            const obj = JSON.parse(str);
            if (typeof obj === 'object' && obj ){
                return true;
            }
            return false;


        }
        catch (e) {
            console.log('error：' + str + '!!!' + e);
            return false;
        }
    }
}
