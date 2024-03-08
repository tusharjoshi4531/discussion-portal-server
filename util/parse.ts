import { Document } from "mongoose";

export const parseMongoDocumentId = <T>(doc: Document): { id: string } & T => ({
  ...doc.toObject(),
  id: doc._id.toString(),
});
