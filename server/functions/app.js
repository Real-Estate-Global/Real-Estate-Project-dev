const express = require('express')
const cors = require('cors')
const serverless = require('serverless-http')
const { authenticateUser, authorizeUser } = require('./auth')
const {
    checkUserRegister,
    userRegister,
    userLogin,
    userLogout,
    getUserData,
    editUserProfile
} = require('./user')
const {
    getPublicOffers,
    getPublicOfferById,
    getOffersForUser,
    createOffer,
    getOfferById,
    editOfferById,
    deleteOfferById,
} = require('./offers')
const {
    getSearchData,
} = require('./search')
const {
    getSelectedFitlersAI,
} = require('./searchAI')

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.post('/api/user/register', checkUserRegister, userRegister);
app.post('/api/user/login', userLogin);
app.get('/api/user/logout', userLogout);
app.get('/api/user/me', authenticateUser, getUserData);
app.put('/api/user/me', authenticateUser, editUserProfile);

app.get('/api/data/search/getSelectedFitlersAI', getSelectedFitlersAI);
app.get('/api/data/search/searchData', getSearchData);
app.get('/api/data/offers', getPublicOffers);
app.get('/api/data/offers/:id', getPublicOfferById);

app.get('/api/protected/myOffers', authenticateUser, getOffersForUser);
app.post('/api/protected/myOffers', authenticateUser, createOffer);
app.get('/api/protected/myOffers/:id', authenticateUser, getOfferById);
app.put('/api/protected/myOffers/:id', authenticateUser, editOfferById);
app.delete('/api/protected/myOffers/:id', authenticateUser, deleteOfferById);

// Apply authorization middleware to restricted routes
app.get('/api/admin', authenticateUser, authorizeUser('admin'), (req, res) => {
    // Handle admin-only route logic here
});

// TODO: for dev only
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports.handler = serverless(app)