import {
  put, call, takeLatest
} from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import Messages from '../theme/Messages'

const {
  createNewJob,  
  getJob,
  searchJobs,
  favorite,
  unfavorite,
  apply,
  withdrawApply,
  declineApply,
  getMyJobs,
  getFavoriteJobs,
  getApplyJobs,
  hire,
  updateJob,
  payJob,
  writeReview,
  cancelJob,
  deleteProject,
} = api;

////////////////////////////////////////////////////////////////////////
////////////////////////// Create New Job //////////////////////////////
////////////////////////////////////////////////////////////////////////
function* CreateNewJob(action) {
  yield put({ type: Types.CREATE_NEW_JOB_REQUEST });
  try {
    const res = yield call(createNewJob, action.job);
    if (res.result) {
      yield put({ type: Types.CREATE_NEW_JOB_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.CREATE_NEW_JOB_FAILURE, error: res.packages });
    }
  } catch (error) {
    yield put({ type: Types.CREATE_NEW_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Update Job ////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* UpdateJob(action) {
  yield put({ type: Types.UPDATE_JOB_REQUEST });
  try {
    const res = yield call(updateJob, action.job);
    if (res.result) {
      yield put({ type: Types.UPDATE_JOB_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.UPDATE_JOB_FAILURE, error: res.packages });
    }
  } catch (error) {
    yield put({ type: Types.UPDATE_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Get My Jobs ////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetMyJobs(action) {
  yield put({ type: Types.GET_MY_JOBS_REQUEST });
  try {
    const res = yield call(getMyJobs, action.user_id, action.user_type);
    if (res.result) {
      yield put({ type: Types.GET_MY_JOBS_SUCCESS, payload: res.jobs });
    } else {
      yield put({ type: Types.GET_MY_JOBS_FAILURE, error: res.message });
    }
  } catch (error) {
    yield put({ type: Types.GET_MY_JOBS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////// Get Favorite Jobs ///////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetFavoritedJobs(action) {
  yield put({ type: Types.GET_FAVORITE_JOBS_REQUEST });
  try {
    const res = yield call(getFavoriteJobs, action.user_id);
    if (res.result) {
      yield put({ type: Types.GET_FAVORITE_JOBS_SUCCESS, payload: res.jobs });
    } else {
      yield put({ type: Types.GET_FAVORITE_JOBS_FAILURE, error: res.message });
    }
  } catch (error) {
    yield put({ type: Types.GET_FAVORITE_JOBS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Get Apply Jobs /////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetApplyJobs(action) {
  yield put({ type: Types.GET_APPLY_JOBS_REQUEST });
  try {
    const res = yield call(getApplyJobs, action.user_id);
    if (res.result) {
      yield put({ type: Types.GET_APPLY_JOBS_SUCCESS, payload: res.jobs });
    } else {
      yield put({ type: Types.GET_APPLY_JOBS_FAILURE, error: res.message });
    }
  } catch (error) {
    yield put({ type: Types.GET_APPLY_JOBS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////// Get Job /////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetJob(action) {
  yield put({ type: Types.GET_JOB_REQUEST });
  try {
    const res = yield call(getJob, action.job_id);
    if (res.result) {
      yield put({ type: Types.GET_JOB_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.GET_JOB_FAILURE, error: res.message });
    }
  } catch (error) {
    yield put({ type: Types.GET_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////////// Search Jobs //////////////////////////////
////////////////////////////////////////////////////////////////////////
function* SearchJobs(action) {
  yield put({ type: Types.SEARCH_JOBS_REQUEST });
  try {
    const res = yield call(searchJobs, action.filters);
    if (res.result) {
      yield put({ type: Types.SEARCH_JOBS_SUCCESS, payload: res.jobs });
    } else {
      yield put({ type: Types.SEARCH_JOBS_FAILURE, error: error.message });
    }
  } catch (error) {
    yield put({ type: Types.SEARCH_JOBS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////// Favorite ////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* Favorite(action) {
  yield put({ type: Types.FAVORITE_REQUEST });
  try {
    const res = yield call(favorite, action.user_id, action.project_id);
    if (res.result) {
      yield put({ type: Types.FAVORITE_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.FAVORITE_FAILURE, error: error.message });
    }
  } catch (error) {
    yield put({ type: Types.FAVORITE_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////// UnFavorite //////////////////////////////
////////////////////////////////////////////////////////////////////////
function* UnFavorite(action) {
  yield put({ type: Types.UNFAVORITE_REQUEST });
  try {
    const res = yield call(unfavorite, action.user_id, action.project_id);
    if (res.result) {
      yield put({ type: Types.UNFAVORITE_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.UNFAVORITE_FAILURE, error: error.message });
    }
  } catch (error) {
    yield put({ type: Types.UNFAVORITE_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////////////// Apply /////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* Apply(action) {
  yield put({ type: Types.APPLY_REQUEST });
  try {
    const res = yield call(
      apply, 
      action.user_id, 
      action.project_id, 
      action.cover_text, 
      action.price,
      action.duration
    );
    if (res.result) {
      yield put({ type: Types.APPLY_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.APPLY_FAILURE, error: error.message });
    }
  } catch (error) {
    yield put({ type: Types.APPLY_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////////// Withdraw Apply ///////////////////////////
////////////////////////////////////////////////////////////////////////
function* WithdrawApply(action) {
  yield put({ type: Types.WITHDRAW_APPLY_REQUEST });
  try {
    const res = yield call(withdrawApply, action.user_id, action.project_id);
    if (res.result) {
      yield put({ type: Types.WITHDRAW_APPLY_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.WITHDRAW_APPLY_FAILURE, error: error.message });
    }
  } catch (error) {
    yield put({ type: Types.WITHDRAW_APPLY_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////////// Decline Apply ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* DeclineApply(action) {
  yield put({ type: Types.DECLINE_APPLY_REQUEST });
  try {
    const res = yield call(declineApply, action.project_id, action.proposal_id);
    if (res.result) {
      yield put({ type: Types.DECLINE_APPLY_SUCCESS, payload: res.job });
    } else {
      yield put({ type: Types.DECLINE_APPLY_FAILURE, error: error.message });
    }
  } catch (error) {
    yield put({ type: Types.DECLINE_APPLY_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////////// Write Review /////////////////////////////
////////////////////////////////////////////////////////////////////////
function* WriteReview(action) {
  yield put({ type: Types.WRITE_REVIEW_REQUEST });
  try {
    const res = yield call(
      writeReview, 
      action.job_id,
      action.text,
      action.score,
    );
    if (res.result) {
      yield put({ type: Types.WRITE_REVIEW_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.WRITE_REVIEW_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.WRITE_REVIEW_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  };
}

////////////////////////////////////////////////////////////////////////
//////////////////////////////// Hire //////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* Hire(action) {
  yield put({ type: Types.HIRE_REQUEST });
  try {
    const res = yield call(
      hire, 
      action.current_user_id,
      action.project_id, 
      action.user_id,
      action.price,
      action.duration,
    );
    if (res.result) {
      yield put({ type: Types.HIRE_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.HIRE_FAILURE, error: error.message });
    }
  } catch (error) {
    yield put({ type: Types.DECLINE_APPLY_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////////// Pay Job ////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* PayJob(action) {
  yield put({ type: Types.PAY_JOB_REQUEST });
  try {
    const res = yield call(
      payJob, 
      action.data, 
    );
    
    if (res.result) {
      yield put({ type: Types.PAY_JOB_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.PAY_JOB_FAILURE, error: res.packages });
    }
  } catch (error) {
    yield put({ type: Types.PAY_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////////// Cancel Job ///////////////////////////////
////////////////////////////////////////////////////////////////////////
function* CancelJob(action) {
  yield put({ type: Types.CANCEL_JOB_REQUEST});
  try {
    const res = yield call(cancelJob, action.project_id);
    if (res.result) {
      yield put({ type: Types.CANCEL_JOB_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.CANCEL_JOB_FAILURE, error: error.message });
    }
  } catch (error) {
    yield put({ type: Types.CANCEL_JOB_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Delete Project /////////////////////////////
////////////////////////////////////////////////////////////////////////
function* DeleteProject(action) {
  yield put({ type: Types.DELETE_PROJECT_REQUEST});
  try {
    const res = yield call(deleteProject, action.project_id);
    if (res.result) {
      yield put({ type: Types.DELETE_PROJECT_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.DELETE_PROJECT_FAILURE, error: error.message });
    }
  } catch (error) {
    yield put({ type: Types.DELETE_PROJECT_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

export default [
  takeLatest(Types.CREATE_NEW_JOB, CreateNewJob),  
  takeLatest(Types.UPDATE_JOB, UpdateJob),   
  takeLatest(Types.GET_JOB, GetJob),
  takeLatest(Types.GET_MY_JOBS, GetMyJobs),
  takeLatest(Types.GET_FAVORITE_JOBS, GetFavoritedJobs),
  takeLatest(Types.GET_APPLY_JOBS, GetApplyJobs),
  takeLatest(Types.SEARCH_JOBS, SearchJobs),
  takeLatest(Types.FAVORITE, Favorite),
  takeLatest(Types.UNFAVORITE, UnFavorite),
  takeLatest(Types.APPLY, Apply),
  takeLatest(Types.WITHDRAW_APPLY, WithdrawApply),
  takeLatest(Types.DECLINE_APPLY, DeclineApply),
  takeLatest(Types.HIRE, Hire),
  takeLatest(Types.PAY_JOB, PayJob),
  takeLatest(Types.WRITE_REVIEW, WriteReview),  
  takeLatest(Types.CANCEL_JOB, CancelJob),
  takeLatest(Types.DELETE_PROJECT, DeleteProject),  
];
