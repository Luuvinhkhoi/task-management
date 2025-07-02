const jwt = require('jsonwebtoken');
const { User } = require('../Model/models');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

module.exports = function(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('No token provided'));

      jwt.verify(token, getKey, {}, async (err, decoded) => {
        if (err) return next(new Error('Invalid token'));

        const cognitoid = decoded.sub;
        const user = await User.findOne({ where: { cognitoid } });
        if (!user) return next(new Error('User not found'));

        socket.user = user.id;
        next();
      });
    } catch (err) {
      console.error('Socket auth error:', err.message);
      next(new Error('Authentication error'));
    }
  });
};
