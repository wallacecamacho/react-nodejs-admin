module.exports = {

  facebookAuth: {
    clientID: '621208508264239', // your App ID
    clientSecret: '640a63dedb60e88a41a36ab6ec7b040f', // your App Secret
    callbackURL: 'http://api.personalinbox.com.br/auth/facebook/callback',
    profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    profileFields: ['id', 'email', 'name'], // For requesting permissions from Facebook API

  },
  twitterAuth: {
    consumerKey: 'your-consumer-key-here',
    consumerSecret: 'your-client-secret-here',
    callbackURL: 'http://localhost:8080/auth/twitter/callback',
  },

  googleAuth: {
    clientID: '546375568410-1ibhlo90ig0jb23c2b65sph4jj7k113d.apps.googleusercontent.com',
    clientSecret: '7y5BfIGXG54D4Nhdu-CW5xex',
    callbackURL: 'http://localhost:3001/api/auth/google/login/callback',
  },

};
