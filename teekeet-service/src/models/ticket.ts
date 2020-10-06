import mongoose from "mongoose";

// An interface that describes all the properties that a Ticket Document (single Ticket instance) can specify.
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userID: string;
}

// Interface that describes required properties to create a new Ticket Model
interface RequiredTicketAttrs {
  title: string;
  price: number;
  userID: string;
}

// Interface that describes the properteies that a Ticket Model has.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: RequiredTicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // TODO: Yep this mixes view concerns with model so not good from an MVC pattern perspective
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Note the use of `function` here is important as using `=>` arrow syntax results in a different/incorrect context for `this`.
ticketSchema.pre("save", async function () {
  // if (this.isModified("password")) {
  //   // Do pre save stuff
  // }
});

// Hack to leverage TypeScript attr type checking. Without this, the model is basically ignored by TypeScript.
ticketSchema.statics.build = (attrs: RequiredTicketAttrs) => {
  return new Ticket(attrs);
};

// Note: Always ensure the model is only built off the schema after defining statics on the schema, else the new static `build` method isn't available.
// FTD: "Note: The .model() function makes a copy of schema. Make sure that you've added everything you want to schema, including hooks, before calling .model()!" - https://mongoosejs.com/docs/models.html
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
