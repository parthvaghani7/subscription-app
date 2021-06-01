const mongoose = require('mongoose');
const { Schema } = mongoose;

const KeysSchema = new Schema({
    key: { type: Schema.Types.ObjectId, required: true, unique: true },
    isExpired: { type: Boolean, default: false }
})

const Keys = mongoose.model('Keys', KeysSchema);

const createKey = (obj) => {
    const key = new Keys(obj);
    return key.save();
}

const updateKey = async (id, update) => {
    await Keys.updateOne({ _id: id }, update);
    return Keys.findById(id);
}

const getKeyByKey = (key) => {
    return Keys.findOne({ key });
}

module.exports = {
    createKey,
    updateKey,
    getKeyByKey,
}