// Medix HMS - ID Generator Service
// Generates standard formatted IDs like PT-2026-0001, DR-2026-0001, etc.

const currentYear = new Date().getFullYear();

const getNextSequence = (list = [], prefix) => {
  if (!Array.isArray(list) || list.length === 0) return "0001";
  
  let maxSeq = 0;
  list.forEach((item) => {
    if (item && item.id && typeof item.id === "string") {
      const parts = item.id.split("-");
      if (parts.length >= 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    }
  });

  return String(maxSeq + 1).padStart(4, "0");
};

export const generatePatientId = (existingList = []) => {
  const seq = getNextSequence(existingList, "PT");
  return `PT-${currentYear}-${seq}`;
};

export const generateDoctorId = (existingList = []) => {
  const seq = getNextSequence(existingList, "DR");
  return `DR-${currentYear}-${seq}`;
};

export const generateStaffId = (existingList = []) => {
  const seq = getNextSequence(existingList, "STF");
  return `STF-${currentYear}-${seq}`;
};

export const generateAppointmentId = (existingList = []) => {
  const seq = getNextSequence(existingList, "APT");
  return `APT-${currentYear}-${seq}`;
};

export const generateBillId = (existingList = []) => {
  const seq = getNextSequence(existingList, "INV");
  return `INV-${currentYear}-${seq}`;
};

export const generateLabId = (existingList = []) => {
  const seq = getNextSequence(existingList, "LAB");
  return `LAB-${currentYear}-${seq}`;
};

export const generatePrescriptionId = (existingList = []) => {
  const seq = getNextSequence(existingList, "RX");
  return `RX-${currentYear}-${seq}`;
};

export const generateAdmissionId = (existingList = []) => {
  const seq = getNextSequence(existingList, "ADM");
  return `ADM-${currentYear}-${seq}`;
};

export const generateReportId = (existingList = []) => {
  const seq = getNextSequence(existingList, "REP");
  return `REP-${currentYear}-${seq}`;
};
