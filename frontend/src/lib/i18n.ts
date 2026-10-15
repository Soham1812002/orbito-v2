import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        welcome: "Welcome",
        dashboard: "Dashboard",
        users: "Users",
        settings: "Settings",
        logout: "Logout",
        signIn: "Sign In",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        actions: "Actions",
        search: "Search...",
        filter: "Filter",
        status: "Status",
        active: "Active",
        inactive: "Inactive"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
