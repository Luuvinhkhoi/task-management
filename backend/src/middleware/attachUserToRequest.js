const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const db = require('../Model/models');
require('dotenv').config();
// Lấy JWKS từ Cognito
const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('Error fetching signing key:', err);
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

const attachUserToRequest = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, getKey, {}, async (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }

    const cognitoid = decoded.sub;

    try {
      const user = await db.User.findOne({ where: { cognitoid } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname:user.lastname,
        avatar:user.avatar,
        phonenumber:user.phonenumber
      };

      next();
    } catch (error) {
      console.error('Database error in attachUserToRequest:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
};

module.exports = attachUserToRequest;
