const db = require('../Model/models');

const attachUserToRequest = async (req, res, next) => {
  try {
    const cognitoId = req.headers['x-user-sub'];

    if (!cognitoId) {
      return res.status(401).json({ message: 'Missing Cognito ID' });
    }

    const user = await db.User.findOne({
      where: { cognitoId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      id: user.userId, 
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error('Error in attachUserToRequest:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = attachUserToRequest;
