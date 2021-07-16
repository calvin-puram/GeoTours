const axios = require('axios');

module.exports = async userData => {
  const { data } = await axios({
    url: 'https://graph.facebook.com/v4.0/oauth/access_token',
    method: 'get',
    params: userData
  });

  return data.access_token;
};
