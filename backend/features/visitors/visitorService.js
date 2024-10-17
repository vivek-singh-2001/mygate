const visitorRepository = require("./visitorRepository");

const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const extractTime = (date) => {
  return date.toTimeString().split(" ")[0];
};

exports.addVisitor = async (visitorData) => {
  const now = new Date();
  const currentDate = new Date(now.setHours(0, 0, 0, 0));
  const visitStartDate = new Date(visitorData.startDate);
  const visitEndDate = new Date(visitorData.endDate);

  if (visitStartDate < currentDate) {
    throw new Error("Visit start date cannot be in the past");
  }

  if (visitEndDate < visitStartDate) {
    throw new Error("Visit end date must be after or equal to start date");
  }

  if (visitStartDate.toDateString() === currentDate.toDateString()) {
    const visitTime = new Date(
      `${visitorData.visit_start_date}T${visitorData.visitTime}`
    );

    if (visitTime < now) {
      throw new Error("Visit time cannot be in the past");
    }
  }

  const passcode = visitorData.type === "Invited" ? generatePasscode() : null;

  return await visitorRepository.createVisitor({
    ...visitorData,
    passcode,
    visitTime: extractTime(new Date(visitorData.visitTime)),
  });
};
