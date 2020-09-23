import mongoose from "mongoose";
import { Secrets } from "../utilities/secrets";

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

// Note the use of `function` here is important as using `=>` arrow syntax results in a different/incorrect context for `this`.
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    await Secrets.toHashedPassword(this.get("password")).then((hashed) => {
      this.set("password", hashed);
    });
  }
});

// Hack to leverage TypeScript attr type checking. Without this, the model is basically ignored by TypeScript.
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Note: Always ensure the model is only built off the schema after defining statics on the schema, else the new static `build` method isn't available.
// FTD: "Note: The .model() function makes a copy of schema. Make sure that you've added everything you want to schema, including hooks, before calling .model()!" - https://mongoosejs.com/docs/models.html
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
