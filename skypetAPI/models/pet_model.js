var mongoose =  require('mongoose');
 var Schema = mongoose.Schema;

const petSchema = new Schema({
    name: {type: String, required: true},
    gender:{type: String, enum: ['Male','Female']},
    owner: {type: Schema.ObjectId, required: true, ref:'User'},
    state: {type: Number, required: true},
    last_location:{type: String},
    last_date:{ type: Date},
    url_photo: {type: String, required:true}

});

module.exports = mongoose.model('Pet', petSchema);