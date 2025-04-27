const mongoose = require('mongoose');

const buttonStatSchema = new mongoose.Schema({
  created_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  clicks: { 
    type: Number, 
    default: 0 
  },
  wastedTime: { 
    type: Number, 
    default: 0 
  },
}, { timestamps: true });

const ButtonStat = mongoose.model('ButtonStat', buttonStatSchema);

module.exports = ButtonStat;