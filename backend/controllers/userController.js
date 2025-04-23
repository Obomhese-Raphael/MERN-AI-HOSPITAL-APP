import User from "../models/UserModel.js";

export const addUser = async (req, res) => {
  const { clerkId, email, firstName, lastName } = req.body; // Fixed destructuring

  try {
    const existingUser = await User.findOne({ clerkId }); // Fixed query object

    if (!existingUser) {
      const newUser = new User({
        // Fixed object creation
        clerkId,
        email,
        firstName,
        lastName,
      });
      await newUser.save();
      console.log("New user saved:", newUser);
    } else {
      // Optionally update existing user
      existingUser.email = email;
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      await existingUser.save();
      console.log("Existing user updated:", existingUser);
    }

    res.status(200).json({ message: "User data synced successfully" });
  } catch (error) {
    console.error("Error syncing user data:", error);
    res.status(500).json({ message: "Failed to sync user data" });
  }
};
