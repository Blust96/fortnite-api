module.exports = {
    username: 'qbohain',
    password: 'qbohain',
    getUrl: (username, password) => {
        return 'mongodb+srv://' + username + ':' + password + '@fortniteapi-6njq0.mongodb.net/fortniteDatas?retryWrites=true';
    }
};
