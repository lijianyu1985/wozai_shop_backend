import cancelOrderAutomaticallyCronJob from './cancelOrderAutomatically';

export function startAll(){
    cancelOrderAutomaticallyCronJob.start();
}

//https://github.com/kelektiv/node-cron
export default {
    startAll,
    cancelOrderAutomaticallyCronJob
};
