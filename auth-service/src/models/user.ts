import mongoose from "mongoose";

// An interface that describes the properties that a User Document (single User instance) has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Interface that describes properties required to create a new User Model
interface UserAttrs {
  email: string;
  password: string;
}

// Interface that describes the properteies that a User Model has.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hack to leverage TypeScript attr type checking. Without this, the model is basically ignored by TypeScript.
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// For some reason, this must be defined after the statics are updated above, else the new `build` method isn't recognised.
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
