const mongoose = require('mongoose');

const generateCustomId = async (modelName, prefix) => {
    const Model = mongoose.model(modelName);
    const lastDocument = await Model.findOne().sort({ _id: -1 });
    if (lastDocument) {
        const lastId = parseInt(lastDocument._id.split('_')[1], 10);
        return `${prefix}_${String(lastId + 1).padStart(3, '0')}`;
    }
    return `${prefix}_001`;
};

module.exports = generateCustomId;