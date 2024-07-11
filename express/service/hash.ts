import bcrypt from "bcrypt";
export default {
  async compare(str: string, hash: string) {
    try {
      return await bcrypt.compare(str, hash);
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't compare stirng");
    }
  },
  async hash(str: string) {
    try {
      return await bcrypt.hash(str, 10);
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't hash string");
    }
  },
};
