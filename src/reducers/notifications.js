import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  notifications: [],
	unreadNumber: 0,
  notification: {},
	errorMessage: "",

	getUnreadNumberStatus: Status.NONE,
  createNotificationStatus: Status.NONE,
  getMyNotificationsStatus: Status.NONE,
  markReadNotificationStatus: Status.NONE,
  markReadAllNotificationsStatus: Status.NONE,
  removeAllNotificationsStatus: Status.NONE,
};

////////////////////////////////////////////////////////////////////////
////////////////////////// Get UnreadNumber ////////////////////////////
////////////////////////////////////////////////////////////////////////
const getUnreadNumberRequest = (state) => ({
  ...state,
  getUnreadNumberStatus: Status.REQUEST,
});

const getUnreadNumberSuccess = (state, action) => ({
  ...state,
  unreadNumber: action.payload,
  getUnreadNumberStatus: Status.SUCCESS,
});

const getUnreadNumberFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
 getUnreadNumberStatus: Status.FAILURE,
});


////////////////////////////////////////////////////////////////////////
///////////////////////// Create Notification //////////////////////////
////////////////////////////////////////////////////////////////////////
const createNotificationRequest = (state) => ({
  ...state,
  createNotificationStatus: Status.REQUEST,
});

const createNotificationSuccess = (state, action) => ({
  ...state,
  notification: action.payload,
  createNotificationStatus: Status.SUCCESS,
});

const createNotificationFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
 createNotificationStatus: Status.FAILURE,
});

////////////////////////////////////////////////////////////////////////
//////////////////////// Get My Notifications //////////////////////////
////////////////////////////////////////////////////////////////////////
const getMyNotificationsRequest = (state) => ({
  ...state,
  getMyNotificationsStatus: Status.REQUEST,
});

const getMyNotificationsSuccess = (state, action) => {
  state.getMyNotificationsStatus = Status.SUCCESS;
  const notifications = action.payload;
  var unreadMessages = 0;
  if (notifications && notifications.length > 0) {
    notifications.forEach(item => {
      if (!item.isRead) {
        unreadMessages ++;
      }
    });
  }
  state.notifications = notifications;
  state.unreadNumber = unreadMessages;

  return {
    ...state,
  };
};

const getMyNotificationsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
 getMyNotificationsStatus: Status.FAILURE,
});

////////////////////////////////////////////////////////////////////////
////////////////////// Mark Read Notification //////////////////////////
////////////////////////////////////////////////////////////////////////
const markReadNotificationRequest = (state) => ({
  ...state,
  markReadNotificationStatus: Status.REQUEST,
});

const markReadNotificationSuccess = (state, action) => {
  state.markReadNotificationStatus = Status.SUCCESS;
  const notification = action.payload;
  const notifications = state.notifications;

  var unreadMessages = 0;
  if (notifications && notifications.length > 0) {
    for (var i = 0; i < notifications.length; i++) {
      if (notifications[i]._id == notification._id) {
        notifications[i].isRead = true;
      }  
      if (!notifications[i].isRead) {
        unreadMessages ++;
      }
    }
  }
  state.notifications = notifications;
  state.unreadNumber = unreadMessages;
  
  return {
    ...state,
  };
};

const markReadNotificationFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  markReadNotificationStatus: Status.FAILURE,
});

////////////////////////////////////////////////////////////////////////
///////////////////// Mark Read All Notifications //////////////////////
////////////////////////////////////////////////////////////////////////
const markReadAllNotificationsRequest = (state) => ({
  ...state,
  markReadAllNotificationsStatus: Status.REQUEST,
});

const markReadAllNotificationsSuccess = (state, action) => {
  state.markReadAllNotificationsStatus = Status.SUCCESS;
  const list = [...state.notifications];

  if (list && list.length > 0) {
    list.forEach(n => {
      n.isRead = true;
    });
  }
  state.notifications = list;
  state.unreadNumber = 0;
  
  return {
    ...state,
  };
};

const markReadAllNotificationsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  markReadAllNotificationsStatus: Status.FAILURE,
});

////////////////////////////////////////////////////////////////////////
////////////////////// Remove All Notifications ////////////////////////
////////////////////////////////////////////////////////////////////////
const removeAllNotificationsRequest = (state) => ({
  ...state,
  removeAllNotificationsStatus: Status.REQUEST,
});

const removeAllNotificationsSuccess = (state, action) => {
  state.removeAllNotificationsStatus = Status.SUCCESS;
  state.notifications = [];
  state.unreadNumber = 0;
  return {
    ...state,
  };
};

const removeAllNotificationsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  removeAllNotificationsStatus: Status.FAILURE,
});

////////////////////////////////////////////////////////////////////////
//////////////////////// Reset Notification ////////////////////////////
////////////////////////////////////////////////////////////////////////
const resetNotification = (state, action) => {
  state.notifications = [];
  state.unreadNumber = 0;
  state.notification = {};
  state.errorMessage = "";

  state.getUnreadNumberStatus = Status.NONE;
  state.createNotificationStatus = Status.NONE;
  state.getMyNotificationsStatus = Status.NONE;
  state.markReadNotificationStatus = Status.NONE;
  state.markReadAllNotificationsStatus = Status.NONE;
  state.removeAllNotificationsStatus = Status.NONE;

  return {
    ...state,
  };
};

const actionHandlers = {
  [Types.GET_UNREADNUMBER_REQUEST]: getUnreadNumberRequest,
  [Types.GET_UNREADNUMBER_SUCCESS]: getUnreadNumberSuccess,
  [Types.GET_UNREADNUMBER_FAILURE]: getUnreadNumberFailure,

  [Types.CREATE_NOTIFICATION_REQUEST]: createNotificationRequest,
  [Types.CREATE_NOTIFICATION_SUCCESS]: createNotificationSuccess,
  [Types.CREATE_NOTIFICATION_FAILURE]: createNotificationFailure,

  [Types.GET_MY_NOTIFICATIONS_REQUEST]: getMyNotificationsRequest,
  [Types.GET_MY_NOTIFICATIONS_SUCCESS]: getMyNotificationsSuccess,
  [Types.GET_MY_NOTIFICATIONS_FAILURE]: getMyNotificationsFailure,

  [Types.MARK_READ_NOTIFICATION_REQUEST]: markReadNotificationRequest,
  [Types.MARK_READ_NOTIFICATION_SUCCESS]: markReadNotificationSuccess,
  [Types.MARK_READ_NOTIFICATION_FAILURE]: markReadNotificationFailure,

  [Types.MARK_READ_ALL_NOTIFICATIONS_REQUEST]: markReadAllNotificationsRequest,
  [Types.MARK_READ_ALL_NOTIFICATIONS_SUCCESS]: markReadAllNotificationsSuccess,
  [Types.MARK_READ_ALL_NOTIFICATIONS_FAILURE]: markReadAllNotificationsFailure,

  [Types.REMOVE_ALL_NOTIFICATIONS_REQUEST]: removeAllNotificationsRequest,
  [Types.REMOVE_ALL_NOTIFICATIONS_SUCCESS]: removeAllNotificationsSuccess,
  [Types.REMOVE_ALL_NOTIFICATIONS_FAILURE]: removeAllNotificationsFailure,

  [Types.RESET_NOTIFICATION]: resetNotification,
};

export default createReducer(initialState, actionHandlers);
