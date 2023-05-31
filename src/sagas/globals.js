import { put, call, takeLatest } from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import Messages from '../theme/Messages'

const {
  getGlobalData,
  getGeoData,
  getZipCode,
  getArriveTime,
  uploadFile,
  getAds,
  addAdsClick,
  addAdsShow,
} = api;

////////////////////////////////////////////////////////////////////////
/////////////////////////// Get Categories /////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetGlobalData(action) {
  yield put({ type: Types.GET_GLOBAL_DATA_REQUEST });
  try {
    const res = yield call(getGlobalData);
    if (res.result) {
      yield put({ type: Types.GET_GLOBAL_DATA_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.GET_GLOBAL_DATA_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.GET_GLOBAL_DATA_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Get Geo Data //////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetGeoData(action) {
  yield put({ type: Types.GET_GEODATA_REQUEST });
  try {
    const res = yield call(getGeoData, action.data.address);
    if (res.result) {
      res['page'] = action.data.page;
      yield put({ type: Types.GET_GEODATA_SUCCESS, payload: res });
    } 
    else {
      yield put({ type: Types.GET_GEODATA_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.GET_GEODATA_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Get Zip Code //////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetZipCode(action) {
  yield put({ type: Types.GET_ZIP_CODE_REQUEST });
  try {
    const res = yield call(getZipCode, action.lat, action.lng);
    if (res.result) {
      yield put({ type: Types.GET_ZIP_CODE_SUCCESS, payload: res.zipcode });
    } else {
      yield put({ type: Types.GET_ZIP_CODE_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.GET_ZIP_CODE_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Get Arrive Time ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetArriveTime(action) {
  yield put({ type: Types.GET_ARRIVE_TIME_REQUEST });
  try {
    const res = yield call(getArriveTime, action.lat1, action.lng1, action.lat2, action.lng2);
    if (res.rows && res.rows.length > 0) {
      const elements = res.rows[0].elements;
      if (elements.length > 0) {
        const duration = elements[0].distance.value;
        yield put({ type: Types.GET_ARRIVE_TIME_SUCCESS, payload: duration });
      } else {
        yield put({ type: Types.GET_ARRIVE_TIME_FAILURE, error: res.error });
      }
    } else {
      yield put({ type: Types.GET_ARRIVE_TIME_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.GET_ARRIVE_TIME_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Upload File ///////////////////////////////
////////////////////////////////////////////////////////////////////////
function* UploadFile(action) {
  yield put({ type: Types.UPLOAD_ATTACH_FILE_REQUEST });
  try {
    const res = yield call(uploadFile, action.file);
    if (res.result) {
      yield put({ type: Types.UPLOAD_ATTACH_FILE_SUCCESS, payload: res});
    } else {
      yield put({ type: Types.UPLOAD_ATTACH_FILE_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.UPLOAD_ATTACH_FILE_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////// Get Ads /////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetAds(action) {
  yield put({ type: Types.GET_ADS_REQUEST });
  try {
    const res = yield call(getAds, action.data);
    if (res.result) {
      yield put({ type: Types.GET_ADS_SUCCESS, payload: res.ads });
    } else {
      yield put({ type: Types.GET_ADS_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.GET_ADS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Add Ads Show ///////////////////////////////
////////////////////////////////////////////////////////////////////////
function* AddAdsShow(action) {
  yield put({ type: Types.ADD_ADS_SHOW_REQUEST });
  try {
    const res = yield call(addAdsShow, action.id);
    if (res.result) {
      yield put({ type: Types.ADD_ADS_SHOW_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.ADD_ADS_SHOW_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.ADD_ADS_SHOW_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////// Add Ads Click ///////////////////////////////
////////////////////////////////////////////////////////////////////////
function* AddAdsClick(action) {
  yield put({ type: Types.ADD_ADS_CLICK_REQUEST });
  try {
    const res = yield call(addAdsClick, action.id);
    if (res.result) {
      yield put({ type: Types.ADD_ADS_CLICK_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.ADD_ADS_CLICK_FAILURE, error: res.error });
    }
  } catch (error) {
    yield put({ type: Types.ADD_ADS_CLICK_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////////// Close Ads ////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* CloseAds(action) {
  yield put({ type: Types.CLOSE_ADS_REQUEST });
  try {
    yield put({ type: Types.CLOSE_ADS_SUCCESS, payload: '' });
  } catch (error) {
    yield put({ type: Types.CLOSE_ADS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

export default [
  takeLatest(Types.GET_GLOBAL_DATA, GetGlobalData),
  takeLatest(Types.GET_GEODATA, GetGeoData),
  takeLatest(Types.GET_ARRIVE_TIME, GetArriveTime),
  takeLatest(Types.GET_ZIP_CODE, GetZipCode),
  takeLatest(Types.UPLOAD_ATTACH_FILE, UploadFile),
  takeLatest(Types.GET_ADS, GetAds),
  takeLatest(Types.ADD_ADS_CLICK, AddAdsClick),
  takeLatest(Types.ADD_ADS_SHOW, AddAdsShow),
  takeLatest(Types.CLOSE_ADS, CloseAds),
];
