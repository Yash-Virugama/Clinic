export const generateClinicPatientId = (patientId, clinicName) => {
  if (!patientId) return "";
  const prefix = clinicName ? clinicName.substring(0, 3).toLowerCase() : "phy";
  const suffix = patientId.substring(patientId.length - 4);
  return `${prefix}-${suffix}`;
};

export const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

export const formatDateInputValue = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

export const formatTimeRange = (timeStr, durationMins) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(h, m, 0, 0);

  const endDate = new Date(startDate.getTime() + durationMins * 60000);
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  return `${formatTime(startDate)} - ${formatTime(endDate)}`;
};

export const getPercentage = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

export const mapZodErrors = (issues, defaults = {}) => {
  const nextErrors = { ...defaults };
  issues.forEach((issue) => {
    if (issue.path[0]) {
      nextErrors[issue.path[0]] = issue.message;
    }
  });
  return nextErrors;
};

export const scrollClinicContentToTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const mainEl = document.querySelector("main");
  if (mainEl) {
    mainEl.scrollTop = 0;
  }
};
