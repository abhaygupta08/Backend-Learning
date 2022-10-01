var axios = require('axios');
var qs = require('qs');

exports.CheckMail = mail => {

    var data = qs.stringify({
        'em': mail,
        'ch': 'l66ejgw8bwqklecppcxb',
        'hl': 'checkeremail.com',
        'frm': 'example@gmail.com'
    });
    var config = {
        method: 'post',
        url: 'https://checkeremail.com/checker-validation.php',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return "Error in Server"
        });


}

