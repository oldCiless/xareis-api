const axios = require('axios');
const queryString = require('querystring');

const axiosConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
};

exports.sendMessage = async (phone, message) => {
    const body = {
        login: process.env.M2M_API_LOGIN,
        password: process.env.M2M_API_PASSWORD,
        msid: phone,
        message,
        naming: message,
    };

    try {
        const response = await axios.post(
            `${process.env.M2M_API_LINK}SendMessage`,
            queryString.stringify(body),
            axiosConfig,
        );
        console.log(response);
        if (response.res.statusCode === 200) {
            return true;
        }
    } catch (e) {
        console.log(e);
        return e;
    }
};
