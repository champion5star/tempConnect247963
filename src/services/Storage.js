import AsyncStorage from '@react-native-async-storage/async-storage';

const USERID_KEY = 'USERID';
const TOKEN_KEY = 'TOKEN';
const CURRENT_USER_KEY = 'CURRENT_USER';
const IS_CUSTOMER_TUTORIAL_KEY = 'IS_CUSTOMER_TUTORIAL';
const IS_PROVIDER_TUTORIAL_KEY = 'IS_PROVIDER_TUTORIAL';
const APPLE_USERS_KEY = 'APPLE_USERS_KEY';
const SIGNUP_USER_KEY = 'SIGNUP_USER_KEY';

export const USERID = {
  get: async () => {
    const user_id = await AsyncStorage.getItem(USERID_KEY);
    if (user_id) {
      return user_id;
    }
    return '';
  },
  set: (user_id) => AsyncStorage.setItem(USERID_KEY, user_id),
  remove: () => AsyncStorage.removeItem(USERID_KEY),
};

export const TOKEN = {
  get: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      return token;
    }
    return '';
  },
  set: (token) => AsyncStorage.setItem(TOKEN_KEY, token),
  remove: () => AsyncStorage.removeItem(TOKEN_KEY),
};

export const CURRENT_USER = {
  set: (user) => AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)),
  get: () => AsyncStorage.getItem(CURRENT_USER_KEY).then((user) => (user ? JSON.parse(user) : [])),
  remove: () => AsyncStorage.removeItem(CURRENT_USER_KEY),
};

export const IS_CUSTOMER_TUTORIAL = {
  get: () => AsyncStorage.getItem(IS_CUSTOMER_TUTORIAL_KEY).then((value) => (value ? value : '')),
  set: () => AsyncStorage.setItem(IS_CUSTOMER_TUTORIAL_KEY, 'YES'),
  remove: () => AsyncStorage.removeItem(IS_CUSTOMER_TUTORIAL_KEY),
};

export const IS_PROVIDER_TUTORIAL = {
  get: () => AsyncStorage.getItem(IS_PROVIDER_TUTORIAL_KEY).then((value) => (value ? value : '')),
  set: () => AsyncStorage.setItem(IS_PROVIDER_TUTORIAL_KEY, 'YES'),
  remove: () => AsyncStorage.removeItem(IS_PROVIDER_TUTORIAL_KEY),
};

export const APPLE_USERS = {
  set: (users) => AsyncStorage.setItem(APPLE_USERS_KEY, JSON.stringify(users)),
  get: () => AsyncStorage.getItem(APPLE_USERS_KEY).then((users) => (users ? JSON.parse(users) : [])),
  remove: () => AsyncStorage.removeItem(APPLE_USERS_KEY),
};

export const SIGNUP_USER = {
  set: (user) => AsyncStorage.setItem(SIGNUP_USER_KEY, JSON.stringify(user)),
  get: () => AsyncStorage.getItem(SIGNUP_USER_KEY).then((user) => (user ? JSON.parse(user) : [])),
  remove: () => AsyncStorage.removeItem(SIGNUP_USER_KEY),
};