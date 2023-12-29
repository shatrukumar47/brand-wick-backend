const mongoose = require("mongoose");

const BlacklistTokenSchema = mongoose.Schema({
    token: {type: String, required: true, unique: true}
})

const BlacklistTokenModel = mongoose.model("blacklistToken", BlacklistTokenSchema);

module.exports = {
    BlacklistTokenModel
}