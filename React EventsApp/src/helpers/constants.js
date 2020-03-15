export const PASSWORD_MIN_LENGTH = 6;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const REGISTER_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDd8TxVsQtDGbDpQ3-2bV9binkfDHRYbos";
export const LOGIN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDd8TxVsQtDGbDpQ3-2bV9binkfDHRYbos";
export const GET_USER_DATA_URL = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDd8TxVsQtDGbDpQ3-2bV9binkfDHRYbos";
export const USER_THEME_URL = "/userThemes";

export const DATE_OPTIONS = { day: "2-digit", month: "2-digit", year: "numeric" };

export const FIRESTORE_URL = "https://storage.googleapis.com/storage/v1";

export const EVENT_TITLE_MIN_LENGTH = 3;
export const EVENTS_URL = "/events";
export const EVENT_IMAGE_INVALID_TYPE_ERROR = "Invalid file type";

export const BOOKINGS_URL = "/bookings";

export const DEFAULT_THEME = "dark";
export const BLUE_THEME = "primary";
export const GREEN_THEME = "success";
export const RED_THEME = "danger";
export const GRAY_THEME = "secondary";
export const LIGHT_BLUE_THEME = "info";

export const THEMES_ARRAY = [DEFAULT_THEME, BLUE_THEME, GREEN_THEME, RED_THEME, GRAY_THEME, LIGHT_BLUE_THEME];


