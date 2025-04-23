import Newsletter from "../models/Newsletter";

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res
        .status(409)
        .json({ message: "You are already subscribed to our newsletter." });
    }

    const newSubscription = new Newsletter({ email });
    await newSubscription.save();
    res
      .status(201)
      .json({ message: "Successfully subscribed to the newsletter!" });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({ message: "Failed to subscribe to the newsletter." });
  }
};
