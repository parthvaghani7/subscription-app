const {
    createUser,
    getUserByPhone,
    getUserById,
    deleteUser,
    login,
} = require('../models/User');
const { getKeyByKey } = require('../models/Keys');
const { QueryResult } = require('../vo/QueryResult');
const { ErrorResponse } = require('../vo/ErrorResponse');

const singUp = async (req, res) => {
    const { name, phone, password, key } = req.body;
    const keyValidate = await getKeyByKey(key);
    if ((!!keyValidate && keyValidate.key === key && keyValidate.isExpired) || !keyValidate) {
        return new ErrorResponse(400, 'Key Not Exists', 'Key is invalid or not exists');
    }
    const user = {
        name,
        phone,
        password,
        key,
    };
    const existing = await getUserByPhone(phone);
    if (!!existing) {
        return new ErrorResponse(500, 'User Exists', 'User with that phone already exists.');
    }
    const data = await createUser(user);
    data.password = null;
return new QueryResult(data);
}

const signIn = async (req, res) => {
    const { phone, password } =  req.body;
    const user = await getUserByPhone(phone);
    if (!user) {
        return new ErrorResponse(500, 'User Not Exists', 'User with that phone not exist.');
    }
    const { keys } = user;
    if ((!!keys && keys.length && !!keys[0].key && keys[0].isExpired) || !keys) {
        return new ErrorResponse(400, 'Key Not Exists', 'Key is invalid or not exists');
    }
    return new QueryResult(await login({ phone, password }, res));
};

const deleteUserService = async (id) => {
    const toDelete = await getUserById(id);
    if (!toDelete) {
        return new ErrorResponse(403, 'Unauthorized');
    }
    await deleteUser(id);
    return new QueryResult({});
}

module.exports = {
    singUp,
    signIn,
    deleteUserService,
}

