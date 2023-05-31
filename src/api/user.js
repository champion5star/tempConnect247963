/* eslint-disable no-undef */
import { url } from '../constants';
import { Platform } from 'react-native';
import { filterFileUri, filterFileName } from '../functions';
import * as Storage from '../services/Storage';

/////////////////////////////////////////////////////////////
////////////////////// Login User ///////////////////////////
/////////////////////////////////////////////////////////////
export const loginUser = (email, password, player_id, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/login`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email, 
    password, 
    device_token: player_id, 
    lat: lat,
    lng: lng,
    os: Platform.OS,    
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
/////////////////// Login With Social ///////////////////////
/////////////////////////////////////////////////////////////
export const loginWithSocial = (user, player_id, lat, lng) => {
  const method = 'POST';
  const request_url = `${url}/user/login_with_social`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user: user,
    device_token: player_id,
    os: Platform.OS,
    lat: lat,
    lng: lng,
    os: Platform.OS,    
  });

  return fetch(request_url, { method, body, headers})
    .then(res => res.json())
    .then(res => {
        if (res.needToSignUp) {
          res.result = true;
          res.user = user;
        }
        return res;
      }
    );
};

/////////////////////////////////////////////////////////////
////////////////////// Check Email //////////////////////////
/////////////////////////////////////////////////////////////
export const checkEmail = (email) => {
  const method = 'POST';
  const request_url = `${url}/user/check_email`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
  });

  return fetch(request_url, { method, body, headers})
    .then(res => res.json())
    .then(res => {
        return res;
      }
    );
};

/////////////////////////////////////////////////////////////
/////////////////// Register Customer ///////////////////////
/////////////////////////////////////////////////////////////
export const registerCustomer = (user) => {
  const method = 'POST';
  const request_url = `${url}/user/register_customer`
  const headers = {
    'Content-Type': 'application/json',
  }

  var socialId = '';
  var socialType = '';
  var avatar = '';

  if (user.socialId) {
      socialId = user.socialId; 
  }

  if (user.socialType) {
      socialType = user.socialType; 
  }

  if (user.avatar) {
      avatar = user.avatar; 
  }

  const body = JSON.stringify({ 
    company: user.company,
    firstName: user.firstName,
    lastName: user.lastName,                
    email: user.email,
    password: user.password,
    phone: user.phone,
    location: user.location,
    zipcode: user.zipcode,
    socialId: socialId,
    socialType: socialType,
    avatar: avatar,
    device_token: user.player_id,
    infoCubicAccountNumber: user.infoCubicAccountNumber,
    os: Platform.OS,    

    street_number: user.street_number,
    route: user.route,
    city: user.city,
    state: user.state,
    county: user.county,
    country: user.country,
    zipcode: user.zipcode,
    lat: user.lat,
    lng: user.lng,
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
/////////////////// Register Provider ///////////////////////
/////////////////////////////////////////////////////////////
export const registerProvider = (user) => {
  const formData = new FormData();

  // ID Card Images.
  if (user.idCards && user.idCards.length > 0) {
    for (var i = 0; i < user.idCards.length; i++) {
      var card = user.idCards[i];

      var filename = filterFileName(card, Platform.OS);
      var filetype = card.type ? card.type : 'image/jpeg';
      const fileUri = filterFileUri(card.uri, Platform.OS);
      
      formData.append("id_card_" + i, {
          name: filename,
          type: filetype,
          uri: fileUri
      });    
    }
  }

  // Avatar
  if (user.avatar && user.avatar.fileName && user.avatar.fileName.length > 0) {
    var filename = filterFileName(user.avatar, Platform.OS);
    var filetype = user.avatar.type ? user.avatar.type : 'image/jpeg';
    const fileUri = filterFileUri(user.avatar.uri, Platform.OS);

    formData.append("avatar", {
      name: filename,
      type: filetype,
      uri: fileUri
    });    
  } else {
    if (avatar && avatar != "") {
      formData.append("avatar", avatar);
    }
  }

  var socialId = '';
  var socialType = '';
  var avatar = '';

  if (user.socialId) {
      socialId = user.socialId; 
  }

  if (user.socialType) {
      socialType = user.socialType; 
  }

  if (user.avatar) {
      avatar = user.avatar; 
  }

  if (user.firstName && user.firstName != "") {
    formData.append("firstName", user.firstName);
  }
  
  if (user.lastName && user.lastName != "") { 
    formData.append("lastName", user.lastName);
  }

  if (user.company && user.company != "") { 
    formData.append("company", user.company);
  }

  if (user.email && user.email != "") { 
    formData.append("email", user.email);
  }
  
  if (user.phone && user.phone != "") { 
    formData.append("phone", user.phone);
  }

  if (user.location && user.location != "") { 
    formData.append("location", user.location);
  }

  formData.append("lat", user.lat);
  formData.append("lng", user.lng);
  formData.append("street_number", user.street_number);
  formData.append("route", user.route);
  formData.append("city", user.city);
  formData.append("state", user.state);
  formData.append("county", user.county);
  formData.append("country", user.country);
  formData.append("zipcode", user.zipcode);

  if (socialId && socialId != "") {
    formData.append("socialId", socialId);
  }

  if (socialType && socialType != "") {
    formData.append("socialType", socialType);
  }
  
  if (user.password && user.password != "") {
    formData.append("password", user.password);
  }
  
  if (user.title && user.title != "") {
    formData.append("title", user.title);
  }

  if (user.overview && user.overview != "") {
    formData.append("overview", user.overview);
  }

  if (user.hourlyRate && user.hourlyRate != "") {
    formData.append("hourlyRate", user.hourlyRate);
  }

  // Categories.
  if (user.categories && user.categories.length > 0) {
    formData.append("categories", JSON.stringify(user.categories));
  }

  // Skills
  if (user.skills && user.skills.length > 0) {
    formData.append("skills", JSON.stringify(user.skills));
  }

  if (user.educations && user.educations.length > 0) {
    formData.append("educations", JSON.stringify(user.educations));
  }

  if (user.employments && user.employments.length > 0) {
    formData.append("employments", JSON.stringify(user.employments));
  }
  
  if (user.idType && user.idType != "") { 
    formData.append("idType", user.idType);
  }

  if (user.idNumber && user.idNumber != "") { 
    formData.append("idNumber", user.idNumber);
  }

  if (user.idOtherInformation && user.idOtherInformation != "") { 
    formData.append("idOtherInformation", user.idOtherInformation);
  }
  
  if (user.player_id && user.player_id != "") { 
    formData.append("device_token", user.player_id);
  }

  formData.append("os", Platform.OS);

  const request_url = `${url}/user/register_provider`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

/////////////////////////////////////////////////////////////
///////////////////// Create User ///////////////////////////
/////////////////////////////////////////////////////////////
export const createUser = (user, player_id) => {
  const method = 'POST';
  const request_url = `${url}/user/create_account`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    accessCode: user.accessCode,
    email: user.email,
    password: user.password,
    player_id: player_id,
    os: Platform.OS,
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
/////////////////// Forgot Password /////////////////////////
/////////////////////////////////////////////////////////////
export const forgotPassword = (email) => {
  const method = 'POST';
  const request_url = `${url}/user/forgot_password`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
///////////////////// Verify Code ///////////////////////////
/////////////////////////////////////////////////////////////
export const verifyCodePassword = (email, code) => {
  const method = 'POST';
  const request_url = `${url}/user/verify_resetcode`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
    code: code,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
///////////////////// Reset Password ////////////////////////
/////////////////////////////////////////////////////////////
export const resetPassword = (email, password) => {
  const method = 'POST';
  const request_url = `${url}/user/reset_newpassword`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    email: email,
    password: password
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
//////////////////// Change Password ////////////////////////
/////////////////////////////////////////////////////////////
export const changePassword = async (user_id, old_password, new_password) => {
  const method = 'POST';
  const request_url = `${url}/user/change_password`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    id: user_id,
    old_password: old_password,
    new_password: new_password
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
/////////////////////// Get User ////////////////////////////
/////////////////////////////////////////////////////////////
export const getUser = async (user_id, is_update) => {
  const method = 'POST';
  const request_url = `${url}/user/get_user`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id: user_id,                
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
///////////////////// Get Transactions //////////////////////
/////////////////////////////////////////////////////////////
export const getTransactions = async (user_id) => {
  const method = 'POST';
  const request_url = `${url}/payment/get_transactions`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id: user_id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
////////////////////// Withdraw Paypal //////////////////////
/////////////////////////////////////////////////////////////
export const withdrawWithPaypal = async (user_id, paypal, amount) => {
  const method = 'POST';
  const request_url = `${url}/withdraw/request_withdraw`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id: user_id,
    amount: amount,
    payment_type: 'paypal',
    paypal: paypal
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
////////////////////// Withdraw Bank ////////////////////////
/////////////////////////////////////////////////////////////
export const withdrawWithBank = async (user_id, routing_number, account_number, card_number, expire_date, cvc, amount) => {
  const method = 'POST';
  const request_url = `${url}/withdraw/request_withdraw`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id: user_id,
    amount: amount,
    payment_type: 'bank',
    routing_number: routing_number,
    account_number: account_number,
    card_number: card_number,
    expire_date: expire_date,
    cvc: cvc,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
//////////////////// Get Nearby Providers ///////////////////
/////////////////////////////////////////////////////////////
export const getNearbyProviders = async (lat, lng, distance, service_id) => {
  const method = 'POST';
  const request_url = `${url}/user/get_nearby_providers`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    service_id: service_id,
    lat: lat,
    lng: lng,
    distance: distance
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
/////////////////////// Deposit /////////////////////////////
/////////////////////////////////////////////////////////////
export const deposit = async (data) => {
  const method = 'POST';
  const request_url = `${url}/deposit/create_deposit`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
////////////////// Get Paypal Client Token //////////////////
/////////////////////////////////////////////////////////////
export const getPaypalClientToken = async (data) => {
  const method = 'POST';
  const request_url = `${url}/deposit/get_paypal_client_token`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
////////////////// Process Paypal Deposit ///////////////////
/////////////////////////////////////////////////////////////
export const processPaypalDeposit = async (data) => {
  const method = 'POST';
  const request_url = `${url}/deposit/paypal_deposit`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
///////////////////// Update Customer ///////////////////////
/////////////////////////////////////////////////////////////
export const updateCustomer = async (user) => {
  const formData = new FormData();
  if (user.avatarFile) {
    var filename = filterFileName(user.avatarFile, Platform.OS);
    var filetype = user.avatarFile.type ? user.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(user.avatarFile.uri, Platform.OS);
    const params = {
      name: filename,
      type: filetype,
      uri: fileUri
    };
    formData.append("avatar", params);        
  }

  formData.append("id", user.id);

  if (user.company && user.company.length > 0) {
    formData.append("company", user.company);
  }
  else {
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
  }
  
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("location", user.location);
  formData.append("street_number", user.street_number);
  formData.append("route", user.route);
  formData.append("city", user.city);
  formData.append("state", user.state);
  formData.append("county", user.county);
  formData.append("country", user.country);
  formData.append("zipcode", user.zipcode);
  formData.append("lat", user.lat);
  formData.append("lng", user.lng);

  const request_url = `${url}/user/update_customer`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    Authorization: jwtToken,
  }

  return fetch(request_url, {
      method: "POST",
      body: formData,
      headers
  })
  .then(response => response.json())
};

export const updateProvider = async(user) => {
  const formData = new FormData();

  // Avatar.
  if (user.avatarFile && user.avatarFile.uri) {
    var filename = filterFileName(user.avatarFile, Platform.OS);
    var filetype = user.avatarFile.type ? user.avatarFile.type : 'image/jpeg';
    const fileUri = filterFileUri(user.avatarFile.uri, Platform.OS);
    formData.append("avatar", {
        name: filename,
        type: filetype,
        uri: fileUri
    });        
  }

  // Resume.
  if (user.resume && user.resume.uri) {
    var filename = user.resume.name;
    var filetype = user.resume.type ? user.resume.type : 'application/pdf';
    const fileUri = filterFileUri(user.resume.uri, Platform.OS);
    formData.append("resume", {
        name: filename,
        type: filetype,
        uri: fileUri
    });        
  }

  if (user.id && user.id != "") {
    formData.append("id", user.id);
  }
  if (user.company && user.company != "") {
    formData.append("company", user.company);
  }
  if (user.firstName && user.firstName != "") {
    formData.append("firstName", user.firstName);
  }
  if (user.lastName && user.lastName != "") {
    formData.append("lastName", user.lastName);
  }
  if (user.email && user.email != "") {
    formData.append("email", user.email);
  }
  if (user.phone && user.phone != "") {
    formData.append("phone", user.phone);
  }
  if (user.location && user.location != "") {
    formData.append("location", user.location);
  }

  formData.append("street_number", user.street_number);
  formData.append("route", user.route);
  formData.append("city", user.city);
  formData.append("state", user.state);
  formData.append("county", user.county);
  formData.append("country", user.country);
  formData.append("zipcode", user.zipcode);
  formData.append("lat", user.lat);
  formData.append("lng", user.lng);
  formData.append("removeResume", user.removeResume);
  
  if (user.title && user.title != "") {
    formData.append("title", user.title);
  }
  if (user.overview && user.overview != "") {
    formData.append("overview", user.overview);
  }
  if (user.hourlyRate && user.hourlyRate != "") {
    formData.append("hourlyRate", user.hourlyRate);
  }
  // Categories.
  if (user.categories && user.categories.length > 0) {
    formData.append("categories", JSON.stringify(user.categories));
  }

  // Skills
  if (user.skills && user.skills.length > 0) {
    formData.append("skills", JSON.stringify(user.skills));
  }
  // Educations.
  if (user.educations && user.educations.length > 0) {
    formData.append("educations", JSON.stringify(user.educations));
  }
  // Employments.
  if (user.employments && user.employments.length > 0) {
    formData.append("employments", JSON.stringify(user.employments));
  }
  // Services.
  if (user.services && user.services.length > 0) {
    formData.append("services", JSON.stringify(user.services));
  }

  const request_url = `${url}/user/update_provider`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    Authorization: jwtToken,
  }

  return fetch(request_url, {
      method: "POST",
      body: formData,
      headers
  })
  .then(response => response.json())
};

/////////////////////////////////////////////////////////////
/////////////////// Update Info Cubic ///////////////////////
/////////////////////////////////////////////////////////////
export const updateInfoCubic = async (data) => {
  const method = 'POST';
  const request_url = `${url}/user/update_infocubic`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////
///////////////// Get InfoCubic Packages ////////////////////
/////////////////////////////////////////////////////////////
export const getInfoCubicPackages = async (data) => {
  const method = 'POST';
  const request_url = `${url}/user/get_info_packages`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};


//////////////////////////////////////////////////////////////////
////////////////////// Change Subscription ///////////////////////
//////////////////////////////////////////////////////////////////
export const changeSubscription = async (user_id, level, subscription) => {
  const method = 'POST';
  const request_url = `${url}/user/change_subscription`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id,   
    level,
    subscription: JSON.stringify(subscription)
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
/////////////////////// Buy Credit ///////////////////////////////
//////////////////////////////////////////////////////////////////
export const buyCredit = async (data) => {
  const method = 'POST';
  const request_url = `${url}/user/buy_credit`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////
/////////////////////// Send Benefit ///////////////////////////////
////////////////////////////////////////////////////////////////////
export const sendBenefit = async (data) => {
  const method = 'POST';
  const request_url = `${url}/user/send_benefit`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////
////////////////////// Search Employees ////////////////////////////
////////////////////////////////////////////////////////////////////
export const searchEmployees = async (data) => {
  const method = 'POST';
  const request_url = `${url}/user/search_employees`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////
////////////////////// Search Employers ////////////////////////////
////////////////////////////////////////////////////////////////////
export const searchEmployers = async (data) => {
  const method = 'POST';
  const request_url = `${url}/user/search_employers`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};