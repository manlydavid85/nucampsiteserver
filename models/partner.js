
const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const partnerSchema = new Schema({
    name: {
        type: String,
        min: 1,
        max: 15,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    feature: {
        type: String,
        required: false
    }
}, {
    description:{
      type: String,  
      required: true
    }
}, {
    timestamps: true
});

const partner = mongoose.model('Partner', partnerSchema);

module.exports = partner;