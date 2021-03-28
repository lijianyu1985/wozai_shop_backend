// mongoosejs user guide
// https://mongoosejs.com/docs/index.html

async function insertSystemLog(Systemlog, source, content) {
    let errorContent;
    if (content instanceof Error){
        errorContent = {
            code: content.code,
            name: content.name,
            type: content.type,
            message: content.message,
            stack: content.stack
        };
    }
    console.log(errorContent || content);

    const sl = new Systemlog({
        source, content: errorContent || content
    });
    await sl.save();
    return sl;
}

export default {
    insertSystemLog
};

