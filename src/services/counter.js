// mongoosejs user guide
// https://mongoosejs.com/docs/index.html

export async function getNextSeq(Counter, type) {
    let seq = null;
    while (!seq){
        const updatedCounter = await Counter.findOneAndUpdate({type},{$inc : {seq : 1}}, {new:true,upsert:true});
        seq = updatedCounter && updatedCounter.seq;
    }
    return seq;
}

export default {
    getNextSeq
};
