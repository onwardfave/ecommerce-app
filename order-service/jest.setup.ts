module.exports = async () => {
    process.env.PRODUCT_SERVICE_BASE_URL = 'http://localhost/api/v0';
    process.env.USER_SERVICE_BASE_URL = 'http://localhost/api/v0/auth';
};
