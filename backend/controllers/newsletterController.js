import Newsletter from "../models/NewsletterModel.js";

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.status(409).json({
        message: "This email is already subscribed.",
      });
    }

    await Newsletter.create({ email });
    res.status(201).json({
      message: "Thank you for subscribing!",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({
      message: "Subscription failed. Please try again.",
    });
  }
};
