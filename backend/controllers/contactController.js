const { default: Contact } = require("../models/Contact");

export const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res
      .status(201)
      .json({
        message:
          "Your message has been received. We will get back to you soon!",
      });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Failed to submit your message." });
  }
};
