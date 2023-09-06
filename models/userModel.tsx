import { Schema, model, models } from "mongoose";
import validator from "validator";
import {ethers} from "ethers";

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: (props: any) => `${props.value} is not a valid email address`,
      },
    },

    firstName: {
      type: String,
      // required: true,
    },

    lastName: {
      type: String,
      // required: true,
    },

    signature: {
        type: String,
        // required: true,
        immutable: true,
        default: ()=> ethers.Wallet.createRandom().privateKey
    },

    age: {
      type: Number,
      // required: true,
    },

    socialMedia: [String],

    bio: {
        type: String,
        maxLength: 100
    },

    avatar: String,

    auth: String
  },
  { timestamps: true }
);

const UserModel = models.user || model("user", schema);

export default UserModel