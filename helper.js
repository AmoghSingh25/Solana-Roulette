function randomNumber(){
    return Math.floor(Math.random()*5)+1;
}

function getReturnAmount(amount, ratio){
    return amount*ratio;
}

function totalAmtToBePaid(stake){
    // Considering there is no participation fee
    return stake;
}


module.exports={
    randomNumber,
    getReturnAmount,
    totalAmtToBePaid
};