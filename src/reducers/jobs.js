import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  selectedJob: {},
  selectedUser: null,
  myJobs: [],
  jobs: [],
  favoriteJobs: [],
  proposalJobs: [],
  balance: 0,

  createJobStatus: Status.NONE, 
  updateJobStatus: Status.NONE,  
  getMyJobsStatus: Status.NONE,
  getFavoriteJobsStatus: Status.NONE,  
  getApplyJobsStatus: Status.NONE,  
  getJobStatus: Status.NONE,
  searchJobsStatus: Status.NONE,
  favoriteStatus: Status.NONE,
  unfavoriteStatus: Status.NONE,
  applyStatus: Status.NONE,
  withdrawApplyStatus: Status.NONE,
  declineApplyStatus: Status.NONE,
  hireStatus: Status.NONE,
  writeReviewStatus: Status.NONE,
  payJobStatus: Status.NONE,
  cancelJobStatus: Status.NONE,
  deleteProjectStatus: Status.NONE,
};

/////////////////////////////////////////////////////////////////////
////////////////////// Create New Job ///////////////////////////////
/////////////////////////////////////////////////////////////////////
const createNewJobRequest = (state) => ({
  ...state,
  createJobStatus: Status.REQUEST,
});

const createNewJobSuccess = (state, action) => {
  state.createJobStatus = Status.SUCCESS;
  const {job, user} = action.payload;
  var myJobs = [...state.myJobs];
  myJobs.unshift(job);
  state.myJobs = myJobs;
  state.selectedJob = job;
  state.selectedUser = user;
  
  return {
    ...state,
  };
};

const createNewJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  createJobStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
////////////////////// Update Job ///////////////////////////////////
/////////////////////////////////////////////////////////////////////
const updateJobRequest = (state) => ({
  ...state,
  updateJobStatus: Status.REQUEST,
});


const updateJobSuccess = (state, action) => {
  state.updateJobStatus = Status.SUCCESS;
  const job = action.payload.job;
  state.job = job;

  var myJobs = [...state.myJobs];
  for (var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id == job._id) {
      myJobs[i] = job;
        break;
    }
  }
  state.myJobs = myJobs;
  
  return {
    ...state,
  };
};

const updateJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  updateJobStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
////////////////////// Get My Jobs //////////////////////////////////
/////////////////////////////////////////////////////////////////////
const getMyJobsRequest = (state) => ({
  ...state,
  getMyJobsStatus: Status.REQUEST,
});

const getMyJobsSuccess = (state, action) => ({
  ...state,
  myJobs: action.payload,
  getMyJobsStatus: Status.SUCCESS,
});

const getMyJobsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getMyJobsStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
////////////////////// Get Favorite Jobs ////////////////////////////
/////////////////////////////////////////////////////////////////////
const getFavoriteJobsRequest = (state) => ({
  ...state,
  getFavoriteJobsStatus: Status.REQUEST,
});

const getFavoriteJobsSuccess = (state, action) => ({
  ...state,
  favoriteJobs: action.payload,
  getFavoriteJobsStatus: Status.SUCCESS,
});

const getFavoriteJobsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getFavoriteJobsStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
/////////////////////// Get Apply Jobs //////////////////////////////
/////////////////////////////////////////////////////////////////////
const getApplyJobsRequest = (state) => ({
  ...state,
  getApplyJobsStatus: Status.REQUEST,
});

const getApplyJobsSuccess = (state, action) => ({
  ...state,
  proposalJobs: action.payload,
  getApplyJobsStatus: Status.SUCCESS,
});

const getApplyJobsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getApplyJobsStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
////////////////////////// Get Job //////////////////////////////////
/////////////////////////////////////////////////////////////////////
const getJobRequest = (state) => ({
  ...state,
  getJobStatus: Status.REQUEST,
});

const getJobSuccess = (state, action) => ({
  ...state,
  selectedJob: action.payload,
  getJobStatus: Status.SUCCESS,
});

const getJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getJobStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
////////////////////////// Search Jobs //////////////////////////////
/////////////////////////////////////////////////////////////////////
const searchJobsRequest = (state) => ({
  ...state,
  searchJobsStatus: Status.REQUEST,
});

const searchJobsSuccess = (state, action) => ({
  ...state,
  jobs: action.payload,
  searchJobsStatus: Status.SUCCESS,
});

const searchJobsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  searchJobsStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
//////////////////////////// Favorite ///////////////////////////////
/////////////////////////////////////////////////////////////////////
const favoriteRequest = (state) => ({
  ...state,
  favoriteStatus: Status.REQUEST,
});

const favoriteSuccess = (state, action) => {
  state.favoriteStatus = Status.SUCCESS;
  const job = action.payload;
  var jobs = [...state.jobs];
  var favoriteJobs = [...state.favoriteJobs];

  for (var i = 0; i < jobs.length; i++) {
    if (jobs[i]._id == job._id) {
      jobs[i] = job;
        break;
    }
  }

  favoriteJobs.unshift(job);

  state.jobs = jobs;
  state.favoriteJobs = favoriteJobs;
  return {
    ...state,
  };
};

const favoriteFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  favoriteStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
//////////////////////////// unFavorite /////////////////////////////
/////////////////////////////////////////////////////////////////////
const unfavoriteRequest = (state) => ({
  ...state,
  unfavoriteStatus: Status.REQUEST,
});

const unfavoriteSuccess = (state, action) => {
  state.unfavoriteStatus = Status.SUCCESS;
  const job = action.payload;
  var jobs = [...state.jobs];
  var favoriteJobs = [...state.favoriteJobs];

  for (var i = 0; i < jobs.length; i++) {
    if (jobs[i]._id == job._id) {
      jobs[i] = job;
        break;
    }
  }

  for (var i = 0; i < favoriteJobs.length; i++) {
    if (favoriteJobs[i]._id == job._id) {
      favoriteJobs.splice(i, 1);
      break;
    }
  }

  state.jobs = jobs;
  state.favoriteJobs = favoriteJobs;
  return {
    ...state,
  };
};

const unfavoriteFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  unfavoriteStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
//////////////////////////// Apply Job //////////////////////////////
/////////////////////////////////////////////////////////////////////
const applyRequest = (state) => ({
  ...state,
  applyStatus: Status.REQUEST,
});

const applySuccess = (state, action) => {
  state.applyStatus = Status.SUCCESS;
  const job = action.payload;
  var jobs = [...state.jobs];
  var favoriteJobs = [...state.favoriteJobs];
  var proposalJobs = [...state.proposalJobs];

  proposalJobs.unshift(job);

  for (var i = 0; i < jobs.length; i++) {
    if (jobs[i]._id == job._id) {
      jobs.splice(i, 1);
      break;
    }
  }

  for (var i = 0; i < favoriteJobs.length; i++) {
    if (favoriteJobs[i]._id == job._id) {
      favoriteJobs.splice(i, 1);
      break;
    }
  }

  state.jobs = jobs;
  state.favoriteJobs = favoriteJobs;
  state.proposalJobs = proposalJobs;
  return {
    ...state,
  };
};

const applyFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  applyStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
//////////////////////// Withdraw Apply Job /////////////////////////
/////////////////////////////////////////////////////////////////////
const withdrawApplyRequest = (state) => ({
  ...state,
  withdrawApplyStatus: Status.REQUEST,
});

const withdrawApplySuccess = (state, action) => {
  state.withdrawApplyStatus = Status.SUCCESS;
  const job = action.payload;
  var jobs = [...state.jobs];
  var proposalJobs = [...state.proposalJobs];

  for (var i = 0; i < proposalJobs.length; i++) {
    if (proposalJobs[i]._id == job._id) {
      proposalJobs.splice(i, 1);
      break;
    }
  }

  jobs.push(job);

  state.jobs = jobs;
  state.proposalJobs = proposalJobs;
  return {
    ...state,
  };
};

const withdrawApplyFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  withdrawApplyStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
//////////////////////// Decline Apply Job //////////////////////////
/////////////////////////////////////////////////////////////////////
const declineApplyRequest = (state) => ({
  ...state,
  declineApplyStatus: Status.REQUEST,
});

const declineApplySuccess = (state, action) => {
  state.declineApplyStatus = Status.SUCCESS;
  const job = action.payload;
  var myJobs = [...state.myJobs];

  for (var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id == job._id) {
      myJobs[i] = job;
      break;
    }
  }

  state.myJobs = myJobs;
  state.selectedJob = job;
  return {
    ...state,
  };
};

const declineApplyFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  declineApplyStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
///////////////////////// Hire Job //////////////////////////////////
/////////////////////////////////////////////////////////////////////
const hireRequest = (state) => ({
  ...state,
  hireStatus: Status.REQUEST,
});

const hireSuccess = (state, action) => {
  state.hireStatus = Status.SUCCESS;
  const {job} = action.payload;
  var myJobs = [...state.myJobs];

  for (var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id === job._id) {
      myJobs[i] = job;
      break;
    }
  }

  state.myJobs = myJobs;
  state.selectedJob = job;
  
  return {
    ...state,
  };
};

const hireFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  hireStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
///////////////////////// Pay Job ///////////////////////////////////
/////////////////////////////////////////////////////////////////////
const payJobRequest = (state) => ({
  ...state,
  payJobStatus: Status.REQUEST,
});

const payJobSuccess = (state, action) => {
  state.payJobStatus = Status.SUCCESS;
  const job = action.payload.job;
  const balance = action.payload.balance;

  var myJobs = [...state.myJobs];
  for (var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id == job._id) {
      myJobs[i] = job;
        break;
    }
  }

  state.selectedJob = job;
  state.myJobs = myJobs;
  state.balance = balance;
  
  return {
    ...state,
  };
};

const payJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  payJobStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
//////////////////////// Cancel Job /////////////////////////////////
/////////////////////////////////////////////////////////////////////
const cancelJobRequest = (state) => ({
  ...state,
  cancelJobStatus: Status.REQUEST,
});

const cancelJobSuccess = (state, action) => {
  state.cancelJobStatus = Status.SUCCESS;
  const job = action.payload.job;
  
  var myJobs = [...state.myJobs];
  for (var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id == job._id) {
      myJobs[i] = job;
        break;
    }
  }

  state.myJobs = myJobs;
  state.selectedJob = job;
  return {
    ...state,
  };
};

const cancelJobFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  cancelJobStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
/////////////////////// Delete Project //////////////////////////////
/////////////////////////////////////////////////////////////////////
const deleteProjectRequest = (state) => ({
  ...state,
  deleteProjectStatus: Status.REQUEST,
});

const deleteProjectSuccess = (state, action) => {
  state.deleteProjectStatus = Status.SUCCESS;
  const project_id = action.payload.project_id;
  
  var myJobs = [...state.myJobs];
  for (var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id == project_id) {
      myJobs.splice(i, 1);
      break;
    }
  }

  state.myJobs = myJobs;
  return {
    ...state,
  };
};

const deleteProjectFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  deleteProjectStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
//////////////////////// Write Review ///////////////////////////////
/////////////////////////////////////////////////////////////////////
const writeReviewRequest = (state) => ({
  ...state,
  writeReviewStatus: Status.REQUEST,
});

const writeReviewSuccess = (state, action) => {
  state.writeReviewStatus = Status.SUCCESS;
  const job = action.payload.job;
  var myJobs = [...state.myJobs];
  for (var i = 0; i < myJobs.length; i++) {
    if (myJobs[i]._id == job._id) {
      myJobs[i] = job;
        break;
    }
  }

  state.myJobs = myJobs;
  state.selectedJob = job;

  return {
    ...state,
  };
};

const writeReviewFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  writeReviewStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
///////////////////////// Reset Job /////////////////////////////////
/////////////////////////////////////////////////////////////////////
const resetJob = (state, action) => {
  state.selectedJob = {};
  state.selectedUser = null;
  state.myJobs = [];
  state.jobs = [];
  state.favoriteJobs = [];
  state.proposalJobs = [];
  state.balance = 0;

  state.createJobStatus = Status.NONE;
  state.updateJobStatus = Status.NONE;
  state.getMyJobsStatus = Status.NONE;
  state.getFavoriteJobsStatus = Status.NONE;
  state.getApplyJobsStatus = Status.NONE;
  state.getJobStatus = Status.NONE;
  state.searchJobsStatus = Status.NONE;
  state.favoriteStatus = Status.NONE;
  state.unfavoriteStatus = Status.NONE;
  state.applyStatus = Status.NONE;
  state.withdrawApplyStatus = Status.NONE;
  state.declineApplyStatus = Status.NONE;
  state.hireStatus = Status.NONE;
  state.writeReviewStatus = Status.NONE;
  state.payJobStatus = Status.NONE;
  state.cancelJobStatus = Status.NONE;
  state.deleteProjectStatus = Status.NONE;

  return {
    ...state,
  };
};

const actionHandlers = {
  [Types.CREATE_NEW_JOB_REQUEST]: createNewJobRequest,
  [Types.CREATE_NEW_JOB_SUCCESS]: createNewJobSuccess,
  [Types.CREATE_NEW_JOB_FAILURE]: createNewJobFailure,

  [Types.GET_JOB_REQUEST]: getJobRequest,
  [Types.GET_JOB_SUCCESS]: getJobSuccess,
  [Types.GET_JOB_FAILURE]: getJobFailure,

  [Types.SEARCH_JOBS_REQUEST]: searchJobsRequest,
  [Types.SEARCH_JOBS_SUCCESS]: searchJobsSuccess,
  [Types.SEARCH_JOBS_FAILURE]: searchJobsFailure,

  [Types.GET_FAVORITE_JOBS_REQUEST]: getFavoriteJobsRequest,
  [Types.GET_FAVORITE_JOBS_SUCCESS]: getFavoriteJobsSuccess,
  [Types.GET_FAVORITE_JOBS_FAILURE]: getFavoriteJobsFailure,

  [Types.GET_APPLY_JOBS_REQUEST]: getApplyJobsRequest,
  [Types.GET_APPLY_JOBS_SUCCESS]: getApplyJobsSuccess,
  [Types.GET_APPLY_JOBS_FAILURE]: getApplyJobsFailure,

  [Types.GET_MY_JOBS_REQUEST]: getMyJobsRequest,
  [Types.GET_MY_JOBS_SUCCESS]: getMyJobsSuccess,
  [Types.GET_MY_JOBS_FAILURE]: getMyJobsFailure,

  [Types.UPDATE_JOB_REQUEST]: updateJobRequest,
  [Types.UPDATE_JOB_SUCCESS]: updateJobSuccess,
  [Types.UPDATE_JOB_FAILURE]: updateJobFailure,

  [Types.PAY_JOB_REQUEST]: payJobRequest,
  [Types.PAY_JOB_SUCCESS]: payJobSuccess,
  [Types.PAY_JOB_FAILURE]: payJobFailure,

  [Types.FAVORITE_REQUEST]: favoriteRequest,
  [Types.FAVORITE_SUCCESS]: favoriteSuccess,
  [Types.FAVORITE_FAILURE]: favoriteFailure,

  [Types.UNFAVORITE_REQUEST]: unfavoriteRequest,
  [Types.UNFAVORITE_SUCCESS]: unfavoriteSuccess,
  [Types.UNFAVORITE_FAILURE]: unfavoriteFailure,

  [Types.APPLY_REQUEST]: applyRequest,
  [Types.APPLY_SUCCESS]: applySuccess,
  [Types.APPLY_FAILURE]: applyFailure,

  [Types.WITHDRAW_APPLY_REQUEST]: withdrawApplyRequest,
  [Types.WITHDRAW_APPLY_SUCCESS]: withdrawApplySuccess,
  [Types.WITHDRAW_APPLY_FAILURE]: withdrawApplyFailure,

  [Types.DECLINE_APPLY_REQUEST]: declineApplyRequest,
  [Types.DECLINE_APPLY_SUCCESS]: declineApplySuccess,
  [Types.DECLINE_APPLY_FAILURE]: declineApplyFailure,

  [Types.HIRE_REQUEST]: hireRequest,
  [Types.HIRE_SUCCESS]: hireSuccess,
  [Types.HIRE_FAILURE]: hireFailure,

  [Types.WRITE_REVIEW_REQUEST]: writeReviewRequest,
  [Types.WRITE_REVIEW_SUCCESS]: writeReviewSuccess,
  [Types.WRITE_REVIEW_FAILURE]: writeReviewFailure,

  [Types.CANCEL_JOB_REQUEST]: cancelJobRequest,
  [Types.CANCEL_JOB_SUCCESS]: cancelJobSuccess,
  [Types.CANCEL_JOB_FAILURE]: cancelJobFailure,

  [Types.DELETE_PROJECT_REQUEST]: deleteProjectRequest,
  [Types.DELETE_PROJECT_SUCCESS]: deleteProjectSuccess,
  [Types.DELETE_PROJECT_FAILURE]: deleteProjectFailure,

  [Types.RESET_JOB]: resetJob,
};

export default createReducer(initialState, actionHandlers);
