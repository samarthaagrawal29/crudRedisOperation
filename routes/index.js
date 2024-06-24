const router = require('express').Router();
const { create, getAll, userById, update, deleteUser, login } = require('../controllers');
const { validate, cache, jwtAuth } = require('../middlewares');
const { userSchema, updateUserSchema } = require('../validation');


router.post('/users/login', login);

router.get('/users', getAll);
router.post('/users', jwtAuth, validate(userSchema), create);
router.get('/users/:id', jwtAuth, cache, userById);
router.put('/users/:id', jwtAuth, validate(updateUserSchema), update);
router.delete('/users/:id', jwtAuth, deleteUser);

module.exports = router;