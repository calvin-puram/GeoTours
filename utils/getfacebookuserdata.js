const axios = require('axios');

module.exports = async accesstoken => {
  const { data } = await axios({
    url: 'https://graph.facebook.com/me',
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name', 'picture'].join(','),
      access_token: accesstoken
    }
  });

  return data;
};
