export const diagnoseFromSymptoms = (symptoms) => {
  // Simple example - in a real app you'd use more sophisticated analysis
  if (
    symptoms.toLowerCase().includes("headache") &&
    symptoms.toLowerCase().includes("nausea")
  ) {
    return "Possible migraine or tension headache";
  }
  if (
    symptoms.toLowerCase().includes("fever") &&
    symptoms.toLowerCase().includes("cough")
  ) {
    return "Possible respiratory infection";
  }
  return "Requires further evaluation";
};

export const extractTimeReference = (text) => {
  const timeRegex =
    /(\d+\s*(day|week|month|year|hour)s?\s*ago)|(since\s*\w+)|(last\s*\w+)/i;
  const match = text.match(timeRegex);
  return match ? match[0] : "Not specified";
};

export const generateFollowUp = (solutions) => {
  if (
    solutions.toLowerCase().includes("rest") &&
    !solutions.toLowerCase().includes("doctor")
  ) {
    return "Follow up if symptoms persist beyond 3 days";
  }
  if (solutions.toLowerCase().includes("antibiotic")) {
    return "Schedule follow-up after completing medication";
  }
  return "Monitor symptoms and consult if condition worsens";
};

export const calculateAssessmentScore = () => {
  // This would be more sophisticated in a real app
  return Math.floor(Math.random() * 30) + 70; // Random score between 70-100 for demo
};
