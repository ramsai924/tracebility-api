
exports.timestampToDateTime = (timestamp) =>{
    try {
        if(timestamp instanceof  Date){
            return timestamp;
        }else{
            return new Date(parseInt(timestamp) * 1000);
        }
    }catch (err) {
       throw err;
    }
};

exports.toDateToTimeStamp = (dateValue) => {
    try {
        return parseInt((new Date(dateValue).getTime() / 1000).toFixed(0));
    }catch (err) {
        throw err;
    }
};


