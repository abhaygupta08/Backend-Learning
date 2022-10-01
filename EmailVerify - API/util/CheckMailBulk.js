var axios = require('axios');
var qs = require('qs');

exports.CheckMailBulk = mails => {
var data = qs.stringify({
  'em': mails 
});
var config = {
  method: 'post',
  url: 'https://checkeremail.com/bulk_email_check.php',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

return axios(config)
.then(function (response) {
  return response.data;
})
.catch(function (error) {
  return (error);
});

}