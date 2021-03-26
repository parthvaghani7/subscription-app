const mongoose = require('mongoose');
const {
    createKey,
    getKeyByKey,
    updateKey,
} = require('../models/Keys');
const { QueryResult } = require('../vo/QueryResult');

const createKeyService = async () => {
    const key = mongoose.Types.ObjectId();
    return new QueryResult(await createKey({ key }));
}

const updateKeyService = async (req, res) => {
    const { id, ...data } = req.body;
    delete data.key;
    return new QueryResult(await updateKey(id, data));
}

const isValidKey = async (req, res) => {
    const { key } = req.query;
    return new QueryResult(await getKeyByKey(key));
};

module.exports = {
    createKeyService,
    updateKeyService,
    isValidKey,
};

