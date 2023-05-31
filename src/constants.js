import Images from "./theme/Images";

export const url = 'https://admin.tempconnect.app';
// export const url = 'http://localhost:5000';
export const ONE_SIGNAL_APP_ID = 'da2675d6-ef16-4136-9efd-c8778b8966ff';
export const GOOGLE_API_KEY = 'AIzaSyBq3M_jpTupQWPWEUCSVa7j2g5VG9JKMjM'
// export const STRIPE_KEY = 'pk_test_dLJ33IRW8RHlczyqwEYGH7G4'           // Test
export const STRIPE_KEY = 'pk_live_w5jwHiuen5CDwqtp371LXh3k00w64OpLNu'    // Live
export const GOOGLE_SIGNIN_WEB_CLIENT_ID = '705988719876-a4mf4cbog9ed4dlts3jdjpl0bcbso8hh.apps.googleusercontent.com';
export const GOOGLE_SIGNIN_IOS_CLIENT_ID = '705988719876-vhj8gteigfh64hoios7fcrn38ki23g94.apps.googleusercontent.com';
export const ADMOB_IOS_BANNER_ID = 'ca-app-pub-3283940972449234/2217412456';
export const ADMOB_ANDROID_BANNER_ID = 'ca-app-pub-3283940972449234/7101493188';
/**
 * Possible requests status
 */
export const Status = {
  NONE: 'NONE',
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

export const AdsStatus = {
  PLAYING: 'PLAYING',
  CLOSE: 'CLOSE',
  CLICK: 'CLICK'
}

export const IMAGE_COMPRESS_QUALITY = 50;
export const MAX_IMAGE_WIDTH = 500;
export const MAX_IMAGE_HEIGHT = 1000;
export const MAX_DISTANCE = 1000;
export const DEFAULT_DISTANCE = 100;
export const MENU_COUNT_FOR_ADS = 4;

export const PROJECT_TYPES = [
  {
      id: 0,
      label: "One-time project",
      value: "One-time project",
  },
  {
      id: 1,
      label: "Ongoing project",
      value: "Ongoing project",
  },
  {
      id: 2,
      label: "I am not sure",
      value: "I am not sure",
  },
];

export const PAY_TYPES = [
  {
    id: 0,
    label: "Hourly",
    value: "Hourly",
  },
  {
    id: 1,
    label: "Fixed",
    value: "Fixed",
  },
];

export const TOAST_SHOW_TIME = 2000;
export const RELOAD_GLOBAL_TIME = 20000;
export const PASSWORD_MIN_LENGTH = 8

export const BUY_CREDIT = "app.tempconnect.job.buycredit";
export const SUBSCRIPTION_MONTHLY = "app.tempconnect.job.monthly";
export const SUBSCRIPTION_YEARLY = "app.tempconnect.job.yearly";
export const USER_LEVEL = {
  FREE: 0,
  MONTHLY: 1,
  YEARLY: 1,
};

export const JOB_STATUS = {
  OPEN: 0,
  PROGRESSING: 1,
  COMPLETED: 2,
  CANCELED: 3,
};

export const NOTIFICATION_TYPE = {
  APPLY_PROJECT: 0,
  WITHDRAW_PROJECT: 1,
  HIRE: 2,
  DECLINE_APPLY: 3,
  CANCEL_JOB: 4,
  PAY_JOB: 5,
  GIVE_REVIEW: 6,
};

export const PushNotificationTypes = {
  BADGE_UNLOCK: 'BADGE_UNLOCK',
  POST_UPVOTE: 'POST_UPVOTE',
  COMMENT_UPVOTE: 'COMMENT_UPVOTE',
  POST_ANSWER: 'POST_ANSWER',
  NEW_FOLLOWER: 'NEW_FOLLOWER',
  NEW_FOLLOWING_POST: 'NEW_FOLLOWING_POST',
  STREAK_LOST: 'STREAK_LOST',
  MENTION: 'MENTION'
}

export const BENEFIT_TYPE = {
  HEALTH_INSURANCE: 'health_insurance',
  FREE_FINANCIAL_REVIEW: 'free_financial_review',
}

export const USER_TYPE = {
  CUSTOMER: 'customer',
  PROVIDER: 'provider',
}

export const ACCOUNT_TYPE = {
  PERSONAL: 'personal',
  COMPANY: 'company',
}

export const PAY_TYPE = {
  FIXED: "Fixed",
  HOURLY: "Hourly"
}
  
export const BOTTOM_SHEET_TYPE = {
  NOTIFICATION: 'notification',
}

export const NOTIFICATION_BOTTOM_SHEET_DATA = [
  {
    title: "Mark all as read",
    icon: Images.icon_checkmark
  },
  {
    title: "Remove all",
    icon: Images.icon_trash
  },
];

export const DATE_TIME_FORMAT = 'MMMM DD YYYY, hh:mm A';
export const DATE_FORMAT = 'MMMM DD, YYYY';
export const PULLDOWN_DISTANCE = 40;
export const SENDBIRD_APP_ID = '5D68AD11-1845-4496-932E-F7788883DB63';
export const SENDBIRD_APP_TOKEN = '824a1b60f6c53bf2785cb427eedb8d1d377dd98d';
