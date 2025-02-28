const jwt = require("jsonwebtoken");
const MongoDB = require("./db");

const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers['x-authorization'].split(' ')[1];

        // Verify the token
        const decodedToken = jwt.verify(token, 'secretKey');

        // Attach the user ID to the request object
        req.userId = decodedToken.userId;

        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({error: 'Unauthorized'});
    }
};
const authorizeUser = (requiredRole) => async (req, res, next) => {
    try {
        const usersCollection = MongoDB.collection('users');
        const query = {email: req.userId};
        const loggedInUser = await usersCollection.findOne(query);

        if (loggedInUser.role !== requiredRole) {
            return res.status(403).json({error: 'Forbidden'});
        }

        next();
    } catch (error) {
        console.error('Error authorizing user:', error);
        res.status(500).json({error: 'An error occurred while authorizing the user'});
    }
};

module.exports = {
    authenticateUser,
    authorizeUser,
}
