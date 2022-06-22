

const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
            required: [true, 'user id cannot be empty.']
        },
        password: {
            type: String,
            required: [true, "password cannot be empty."]
        },
        Deleted: {
            type: Boolean,
            default: false
        },
        inactive: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        toObject: {
            getters: true,
            versionKey: false,
            transform: (doc, ret) => {
                return ret;
            }
        }
    }
);

module.exports = { schema };
