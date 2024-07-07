const express = require('express')
const cors = require('cors')
const {authenticateUser, authorizeUser} = require('./auth')
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
const PORT = 3000;

app.use(express.json());
app.use(cors())
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.post('/user/register', checkUserRegister, userRegister);
app.post('/user/login', userLogin);
app.get('/user/logout', userLogout);
app.get('/user/me', authenticateUser, getUserData);

app.get('/data/offers', getPublicOffers);
app.get('/data/offers/:id', getPublicOfferById);

app.get('/protected/myOffers', authenticateUser, getOffersForUser);
app.post('/protected/myOffers', authenticateUser, createOffer);
app.get('/protected/myOffers/:id', authenticateUser, getOfferById);
app.put('/protected/myOffers/:id', authenticateUser, editOfferById);
app.delete('/protected/myOffers/:id', authenticateUser, deleteOfferById);

// Apply authorization middleware to restricted routes
app.get('/admin', authenticateUser, authorizeUser('admin'), (req, res) => {
    // Handle admin-only route logic here
});
