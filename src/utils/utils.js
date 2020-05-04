import moment from 'moment';

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

export function formatJsonDate(jsonDateString) {
    if (jsonDateString) {
        return moment.parseZone(jsonDateString).format('MM/DD/YYYY');
    }
    return '';
}

export function formatJsonDateTime(jsonDateString, format) {
    if (jsonDateString) {
        if (format) {
            return moment.parseZone(jsonDateString).format(format);
        }
        return moment.parseZone(jsonDateString).format('MM/DD/YYYY HH:mm:ss');
    }
    return '';
}

export function formatJsonDateString(date) {
    if (date) {
        return '/Date(' + new Date(date).getTime() + ')/';
    }
    return '';
}

export function dateString(){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();
    return (Array(4).join(0) + year).slice(-4)
    + (Array(2).join(0) + month).slice(-2)
    + (Array(2).join(0) + date).slice(-2);
}

export function monthString(){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return (Array(4).join(0) + year).slice(-4)
    + (Array(2).join(0) + month).slice(-2);
}

export function formatDateToDay(thatDate) {
    if (thatDate) {
        const year = thatDate.getFullYear();
        const month = thatDate.getMonth() + 1;
        const date = thatDate.getDate();
        return parseInt((Array(4).join(0) + year).slice(-4)
        + (Array(2).join(0) + month).slice(-2)
        + (Array(2).join(0) + date).slice(-2));
    }
    return null;
}

export function endDateOfDate(thatDate) {
    if (thatDate) {
        const year = thatDate.getFullYear();
        const month = thatDate.getMonth();
        const date = thatDate.getDate();
        return new Date(year, month, date + 1);
    }
    return null;
}

export function startDateOfDate(thatDate) {
    if (thatDate) {
        const year = thatDate.getFullYear();
        const month = thatDate.getMonth();
        const date = thatDate.getDate();
        return new Date(year, month, date);
    }
    return null;
}

export function prefixInteger(num,digit){
    return (Array(digit).join(0) + num).slice(-digit);
}

export function randomNumber(digit){
    let randomNo = '';
    for (let i = 0; i < digit; ++i){
        randomNo += Math.floor(Math.random() * 10);
    }
    return randomNo;
}

