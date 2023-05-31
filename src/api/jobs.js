import { url } from '../constants';
import * as Storage from '../services/Storage';

/////////////////////////////////////////////////////////////////////
///////////////////// Create New Job ////////////////////////////////
/////////////////////////////////////////////////////////////////////
export const createNewJob = async (job) => {
  const method = 'POST';
  const request_url = `${url}/job/create`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }

  var params = {
    title: job.title,
    category: job.category.join(),
    description: job.description,
    type: job.type,
    skills: job.skills.join(),
    payType: job.payType,
    price: job.price,
    duration: job.duration,
    isCheckCubic: job.isCheckCubic,
    infoCubicPackage: job.infoCubicPackage,
    creator: job.creator,
    lat: job.lat,
    lng: job.lng,
    zipcode: job.zipcode,
    location: job.location,
  };

  const body = JSON.stringify(params);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
/////////////////////// Update Job //////////////////////////////////
/////////////////////////////////////////////////////////////////////
export const updateJob = async (job) => {
  const method = 'POST';
  const request_url = `${url}/job/update`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }

  var params = {
    id: job.id,
    title: job.title,
    category: job.category.join(),
    description: job.description,
    type: job.type,
    skills: job.skills.join(),
    payType: job.payType,
    price: job.price,
    duration: job.duration,
    isCheckCubic: job.isCheckCubic,
    infoCubicPackage: job.infoCubicPackage,
    creator: job.creator,
    lat: job.lat,
    lng: job.lng,
    zipcode: job.zipcode,
    location: job.location,
  };

  const body = JSON.stringify(params);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
///////////////////////// Get Job ///////////////////////////////////
/////////////////////////////////////////////////////////////////////
export const getJob = async (job_id) => {
  const method = 'POST';
  const request_url = `${url}/job/get_job`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    job_id,
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
/////////////////////// Search Jobs /////////////////////////////////
/////////////////////////////////////////////////////////////////////
export const searchJobs = async (filters) => {
  const method = 'POST';
  const request_url = `${url}/job/search_jobs`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    filters
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
//////////////////// Get Favorite Jobs //////////////////////////////
/////////////////////////////////////////////////////////////////////
export const getFavoriteJobs = async (user_id) => {
  const method = 'POST';
  const request_url = `${url}/job/get_favorite_jobs`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
/////////////////////// Favorite Job ////////////////////////////////
/////////////////////////////////////////////////////////////////////
export const favorite = async (user_id, project_id) => {
  const method = 'POST';
  const request_url = `${url}/job/favorite`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id,
    project_id
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
////////////////////// Unfavorite Job ///////////////////////////////
/////////////////////////////////////////////////////////////////////
export const unfavorite = async (user_id, project_id) => {
  const method = 'POST';
  const request_url = `${url}/job/unfavorite`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id,
    project_id
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
///////////////////////// Apply /////////////////////////////////////
/////////////////////////////////////////////////////////////////////
export const apply = async (user_id, project_id, cover_text, price, duration) => {
  const method = 'POST';
  const request_url = `${url}/job/apply`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id,
    project_id,
    cover_text,
    price,
    duration
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
//////////////////////// Withdraw Apply /////////////////////////////
/////////////////////////////////////////////////////////////////////
export const withdrawApply = async (user_id, project_id) => {
  const method = 'POST';
  const request_url = `${url}/job/withdraw_apply`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id,
    project_id
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
//////////////////////// Get Apply Jobs /////////////////////////////
/////////////////////////////////////////////////////////////////////
export const getApplyJobs = async (user_id) => {
  const method = 'POST';
  const request_url = `${url}/job/get_apply_jobs`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
////////////////////////// Get My Jobs //////////////////////////////
/////////////////////////////////////////////////////////////////////
export const getMyJobs = async (user_id, user_type) => {
  const method = 'POST';
  const request_url = `${url}/job/get_my_jobs`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    user_id,
    user_type
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
/////////////////////////// Pay Jobs ////////////////////////////////
/////////////////////////////////////////////////////////////////////
export const payJob = async (data) => {
  const method = 'POST';
  const request_url = `${url}/job/pay_job`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }

  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
//////////////////////// Write Review ///////////////////////////////
/////////////////////////////////////////////////////////////////////
export const writeReview = async (job_id, text, score) => {
  const method = 'POST';
  const request_url = `${url}/job/write_review`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    job_id: job_id,
    text: text,
    score: score
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
/////////////////////// Decline Apply ///////////////////////////////
/////////////////////////////////////////////////////////////////////
export const declineApply = async (project_id, proposal_id) => {
  const method = 'POST';
  const request_url = `${url}/job/decline_apply`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    project_id,
    proposal_id,    
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
/////////////////////////// Hire ////////////////////////////////////
/////////////////////////////////////////////////////////////////////
export const hire = async (current_user_id, project_id, user_id, price, duration) => {
  const method = 'POST';
  const request_url = `${url}/job/hire`;
  const jwtToken = await Storage.TOKEN.get();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    current_user_id,
    project_id,
    user_id,    
    price,
    duration
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
////////////////////////// Cancel Job ///////////////////////////////
/////////////////////////////////////////////////////////////////////
export const cancelJob = async (project_id) => {
  const method = 'POST';
  const request_url = `${url}/job/cancel_job`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    project_id,
  });

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

/////////////////////////////////////////////////////////////////////
////////////////////////// Delete Job ///////////////////////////////
/////////////////////////////////////////////////////////////////////
export const deleteProject = async (project_id) => {
  const method = 'POST';
  const request_url = `${url}/job/delete`;
  const jwtToken = await Storage.TOKEN.get();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: jwtToken,
  }
  const body = JSON.stringify({ 
    project_id,
  });

  return fetch(request_url, { method, body, headers })
    .then((res) => res.json());
};