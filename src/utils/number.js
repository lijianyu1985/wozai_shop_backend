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

export default {
    prefixInteger,
    randomNumber
};
