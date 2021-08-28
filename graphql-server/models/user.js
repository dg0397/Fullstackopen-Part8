import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  favoriteGenre: {
    type: String,
    required: true,
    minlength: 4
  }
})

schema.plugin(uniqueValidator)
const User = mongoose.model('User', schema)

export default User
