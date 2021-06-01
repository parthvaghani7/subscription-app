const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const config = require('../../config.json')[process.env.NODE_ENV];

const UserSchema = new Schema({
    name: { type: String },
    // email: { type: String, },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isRemoved: { type: Boolean, default: false },
    key: { type: Schema.Types.ObjectId, ref: 'keys' },
}, {
    toObject: { virtuals: true },
});

UserSchema.virtual('keys', {
    ref: 'Keys',
    localField: 'key',
    foreignField: 'key',
});

const encryptPass = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
}

UserSchema.methods.comparePassword = (passw,pss) => {
    return bcrypt.compareSync(passw, pss);
};

const createUser = async ({ name, phone, password, key }) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const hash = await encryptPass(password);
        let newUser = new User({
            name,
            phone,
            password: hash,
            key,
        });
        newUser = await newUser.save({ session: session });
        await session.commitTransaction();
        await session.endSession();
        return newUser;
    } catch (e) {
        console.log(e);
        console.log('Aborting transation ****************');
        await session.abortTransaction();
        console.log('Transaction aborted');
        await session.endSession();
        return {};
    }
}

const updateUser = async (update, id) => {
    await Users.updateOne({ _id: id }, update);
    return Users.findById(id);
}

const deleteUser = (id) => {
    return User.findByIdAndDelete(id);
}

const login = async ({ phone, password }, res) => {
    User.findOne({ phone }, async (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).send({
                success: false,
                msg: 'Authentication failed. User not found.',
            });
        } else {
            const match = await user.comparePassword(password, user.password)
            if (match) {
                let token = jwt.sign({ user: { id: user._id, phone } }, config.secret);
                res.json({ success: true, token: `Bearer ${token}` });
            } else {
                res.status(401).send();
            }
        }
    });
}

const getUserById = async (id) => {
    return User.findOne({ _id: id })
}

const getUserByPhone = async (phone) => {
    return User.findOne({ phone }).populate('keys')
}

const User = mongoose.model('Users', UserSchema);

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByPhone,
    login
};