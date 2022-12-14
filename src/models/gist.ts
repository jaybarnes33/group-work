import mongoose, { Types, SchemaTypes } from "mongoose";
import User from "./User";

export interface IGistSchema extends mongoose.Document {
  user: Types.ObjectId;
  title: string;
  country: string;
  comments: [];
  categories: string;
  post: string;
  Type:string;
}

const gistSchema = new mongoose.Schema<IGistSchema>(
  {
    user: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: User,
    },
    title: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    categories: {
      type: String,
    },
    post: {
      type: String,
      required: true,
    },
    comments: [],
    Type:{
      type:String,
      default:'gist'
    }
  },
  { timestamps: true }
);

const Gist = mongoose.models.Gist || mongoose.model("Gist", gistSchema);

export default Gist;
