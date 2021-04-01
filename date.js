

function getDate(){
    let today = new Date();
    let option= {
        weekday:"long",
        day:"numeric",
        month:"long"
    }
    let date= today.toLocaleDateString("bn-BD",option);
    return date;
}

function getDay(){
    let today = new Date();
    let option= {
        weekday:"long"
    }
    let date= today.toLocaleDateString("bn-BD",option);
    return date;
}
module.exports={getDate, getDay};
