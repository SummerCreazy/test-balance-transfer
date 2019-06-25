var responseSuccess = function(data){
    let response = {
        result: true,
        data: data
    }
    return response
}

var responseFail = function (message) {
    let response = {
        result: false,
        message: message
    }
    return response
}

exports.responseSuccess = responseSuccess
exports.responseFail = responseFail