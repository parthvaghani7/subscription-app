const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const { singUp, signIn } = require('../services/userService');
const { returnStateHandler } = require('../vo/returnStateHandler');
const { ErrorResponse } = require('../vo/ErrorResponse');

router.post('/signup',[
    check('name').isLength({ min: 1 }).withMessage('name is required'),
    check('phone').isLength({ min: 1 }).withMessage('phone is required'),
    check('password').isLength({ min: 1 }).withMessage('password is required'),
    check('key').isLength({ min: 6 }).withMessage('enter valid key'),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(400, "Mandatory Param Missing", errors.array().map(e => e.msg)));
    }
    next(await singUp(req, res));
}, returnStateHandler);

router.post('/signin', [
    check('phone').isLength({ min: 1 }).withMessage('phone is required'),
    check('password').isLength({ min: 1 }).withMessage('password is required'),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(400, "Mandatory Param Missing", errors.array().map(e => e.msg)));
    }
    return signIn(req, res);
});

module.exports = router;