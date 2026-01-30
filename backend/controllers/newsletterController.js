import Newsletter from "../models/NewsletterModel.js";

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "This email is already subscribed." });
    }

    const newSub = await Newsletter.create({ email });
    console.log("✅ Successfully created newsletter sub:", newSub); // ← important

    return res.status(201).json({ message: "Thank you for subscribing!" });
  } catch (error) {
    console.error("Newsletter subscription FAILED:", error.message);
    console.error(error.stack); // more detail
    return res.status(500).json({
      message: "Subscription failed. Please try again.",
      error: error.message, // ← temporarily expose for dev only!
    });
  }
};
