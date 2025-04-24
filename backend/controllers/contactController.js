import Contact from "../models/ContactModel.js"

export const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Your message has been received. We will get back to you soon!",
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit your message.",
    });
  }
};
