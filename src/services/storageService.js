// Medix HMS - Storage Service for LocalStorage Persistence

export const STORAGE_KEYS = {
  HOSPITAL_INFO: "medix_hms_hospital_info",
  DOCTORS: "medix_hms_doctors",
  STAFF: "medix_hms_staff",
  PATIENTS: "medix_hms_patients",
  APPOINTMENTS: "medix_hms_appointments",
  MEDICINES: "medix_hms_medicines",
  LAB_TESTS: "medix_hms_lab_tests",
  PRESCRIPTIONS: "medix_hms_prescriptions",
  BILLS: "medix_hms_bills",
  BEDS: "medix_hms_beds",
  ADMISSIONS: "medix_hms_admissions",
  FINAL_REPORTS: "medix_hms_final_reports",
  NOTIFICATIONS: "medix_hms_notifications",
  THEME: "medix_hms_theme",
  USER_SESSION: "medix_hms_user_session",
  SIDEBAR_COLLAPSED: "medix_hms_sidebar_collapsed"
};

export const getData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading ${key} from LocalStorage:`, error);
    return defaultValue;
  }
};

export const setData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to LocalStorage:`, error);
    return false;
  }
};

export const removeData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from LocalStorage:`, error);
    return false;
  }
};

export const addItem = (key, newItem) => {
  const currentList = getData(key, []);
  const updatedList = [newItem, ...currentList];
  setData(key, updatedList);
  return updatedList;
};

export const updateItem = (key, id, updatedFields) => {
  const currentList = getData(key, []);
  const updatedList = currentList.map((item) =>
    item.id === id ? { ...item, ...updatedFields } : item
  );
  setData(key, updatedList);
  return updatedList;
};

export const deleteItem = (key, id) => {
  const currentList = getData(key, []);
  const updatedList = currentList.filter((item) => item.id !== id);
  setData(key, updatedList);
  return updatedList;
};

export const resetAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error("Error clearing LocalStorage:", error);
    return false;
  }
};
