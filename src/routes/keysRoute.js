const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const { createKeyService, updateKeyService, isValidKey } = require('../services/keysService');
const { returnStateHandler } = require('../vo/returnStateHandler');
const { ErrorResponse } = require('../vo/ErrorResponse');

router.post('/', async (req, res, next) => {
    next(await createKeyService());
}, returnStateHandler);

router.put('/', [
    check('id').isLength({ min: 1 }).withMessage('id is required'),
    check('isExpired').isLength({ min: 1 }).withMessage('isExpired is required'),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(400, "Mandatory Param Missing", errors.array().map(e => e.msg)));
    }
    next(await updateKeyService(req, res));
}, returnStateHandler);

router.get('/validate', [
    check('key').isLength({ min: 1 }).withMessage('key is required'),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(400, "Mandatory Param Missing", errors.array().map(e => e.msg)));
    }
    next(await isValidKey(req, res));
}, returnStateHandler);

module.exports = router;