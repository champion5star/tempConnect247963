import { url } from '../constants';
import * as Storage from '../services/Storage';

////////////////////////////////////////////////////////////////////////
////////////////////////// Get Unread Number ///////////////////////////
////////////////////////////////////////////////////////////////////////
export const getUnreadNumber = async (user_id) => {
  const method = 'POST';
  const request_url = `${url}/notification/get_unread_number`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id,
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////
///////////////////////// Create Notification //////////////////////////
////////////////////////////////////////////////////////////////////////
export const createNotification = async (notification) => {
  const method = 'POST';
  const request_url = `${url}/notification/create_notification`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    creator: notification.creator,
    receiver: notification.receiver,
    job: notification.job,
    type: notification.type,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////
///////////////////////// Get My Notifications /////////////////////////
////////////////////////////////////////////////////////////////////////
export const getMyNofications = async (user_id) => {
  const method = 'POST';
  const request_url = `${url}/notification/get_my_notifications`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id
  });

  return fetch(request_url, { method, body, headers})
  .then((response) => response.json())
};

////////////////////////////////////////////////////////////////////////
//////////////////////////// Mark As Read //////////////////////////////
////////////////////////////////////////////////////////////////////////
export const markReadNotification = async (notification_id) => {
  const method = 'POST';
  const request_url = `${url}/notification/mark_read_notification`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    notification_id
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////
////////////////////////// Mark As Read All ////////////////////////////
////////////////////////////////////////////////////////////////////////
export const markReadAllNotifications = async(data) => {
  const method = 'POST';
  const request_url = `${url}/notification/mark_read_all`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }

  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////
//////////////////////////// Remove All ////////////////////////////////
////////////////////////////////////////////////////////////////////////
export const removeAllNotifications = async(data) => {
  const method = 'POST';
  const request_url = `${url}/notification/remove_all`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }

  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};