const express = require('express')
const cors = require('cors')
const router = express.Router()
const serverless = require('serverless-http')
const { authenticateUser, authorizeUser } = require('./auth')
const {
    checkUserRegister,
    userRegister,
    userLogin,
    userLogout,
    getUserData,
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

const app = express();

router.post('/user/register', checkUserRegister, userRegister);
router.post('/user/login', userLogin);
router.get('/user/logout', userLogout);
router.get('/user/me', authenticateUser, getUserData);

router.get('/data/search/getSelectedFitlers', getSelectedFitlers);
router.get('/data/search/searchData', getSearchData);

router.get('/data/offers', getPublicOffers);
router.get('/data/offers/:id', getPublicOfferById);

router.get('/protected/myOffers', authenticateUser, getOffersForUser);
router.post('/protected/myOffers', authenticateUser, createOffer);
router.get('/protected/myOffers/:id', authenticateUser, getOfferById);
router.put('/protected/myOffers/:id', authenticateUser, editOfferById);
router.delete('/protected/myOffers/:id', authenticateUser, deleteOfferById);

// Apply authorization middleware to restricted routes
router.get('/admin', authenticateUser, authorizeUser('admin'), (req, res) => {
    // Handle admin-only route logic here
});

app.use(express.json());
app.use(cors());
app.use('/router');
app.use('/.netlify/functions/app', router);  // path must route to lambda

module.exports.handler = serverless(app);