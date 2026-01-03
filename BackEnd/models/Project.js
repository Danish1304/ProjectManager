const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description :{type : String, default: ""},
    status: { type: String, default: "In Progress" },
    // Manual createdAt is gone from here...
}, { timestamps: true }); // ...because it is handled here!

module.exports = mongoose.model('Project', ProjectSchema);