
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const promotionSchema = new Schema({
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
const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;