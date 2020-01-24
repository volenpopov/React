const PASSWORD_MIN_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDd8TxVsQtDGbDpQ3-2bV9binkfDHRYbos';
const LOGIN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDd8TxVsQtDGbDpQ3-2bV9binkfDHRYbos';

const DEFAULT_THEME = 'dark';
const BLUE_THEME = 'primary';
const GREEN_THEME = 'success';
const RED_THEME = 'danger';
const GRAY_THEME = 'secondary';
const LIGHT_BLUE_THEME = 'info';

const THEMES_ARRAY = [DEFAULT_THEME, BLUE_THEME, GREEN_THEME, RED_THEME, GRAY_THEME, LIGHT_BLUE_THEME];

export {
    PASSWORD_MIN_LENGTH,
    EMAIL_REGEX,
    REGISTER_URL,
    LOGIN_URL,
    DEFAULT_THEME,
    THEMES_ARRAY
};
