const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
      select: false,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },

    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },

    picture: {
      type: String,
      default: "../assets/default.jpg",
    },
    bio: {
      type: String,
      max: 1024,
    },
    refreshTokens: {
      default: [],
      type: [String],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// play function before save into display:'block',
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.method("toJSON", function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).select("+password +refreshTokens");
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
