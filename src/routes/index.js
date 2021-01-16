const router = require('express').Router();
const userController = require('../controllers/userController');
const mainController = require('../controllers/mainController');
const ValidationMiddlewares = require('../middlewares/validation');
const authentication = require('../middlewares/authentication')

router.post("/signup", ValidationMiddlewares.validateUserInput, userController.signup);
router.post('/signin', ValidationMiddlewares.validateUserInput, userController.signIn);
router.get('/tempartureByCity/:city/:date', ValidationMiddlewares.validateDateCitySearch, mainController.searchByDateAndCity);
router.put('/changeCityType', authentication, ValidationMiddlewares.validateChangeTypeCity, mainController.changeCityType);


module.exports = router;