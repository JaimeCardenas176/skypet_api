var mongoose =  require('mongoose');
 var Schema = mongoose.Schema;

const petSchema = new Schema({
    nombre: {type: String},
    propietario: {type: Schema.ObjectId, required: false},
    estado: {type: Number},
    lastLocation:{type: String},
    url_foto: {type: String}

});

module.exports = mongoose.model('Mascota', petSchema);