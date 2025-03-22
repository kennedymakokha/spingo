import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = mongoose.model("User", UserSchema);
