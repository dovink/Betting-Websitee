import mangoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mangoose.Schema({
   name: { type: String, required: [true, "Vardas yra reikalingas"] },
   email: {
      type: String,
      required: [true, "El.pasto adresas yra reikalingas"],
      unique: true,
   },
   city: { type: String, required: [true, "Miestas yra reikalingas"] },
   password: { type: String, required: [true, "Slaptazodis yra reikalingas"] },
});

userSchema.pre("save", async function () {
   this.password = await bcrypt.hash(this.password, 12);
});

// 1 argumentas - collection name
const User = mangoose.model("user", userSchema);

export default User;