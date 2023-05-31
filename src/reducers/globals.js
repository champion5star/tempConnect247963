import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import {AdsStatus, Status} from '../constants';

export const initialState = {
	categories: [],
  fee: 0,
  years: [],
  selectedAds: null,

  geoData: {},
  arrivedTime: 0,
  zipcode: '',
  uploadedUrl: '',
  errorMessage: "",
  
	getGlobalDataStatus: Status.NONE,
  getGeoDataStatus: Status.NONE,
  getArriveTimeStatus: Status.NONE,
  getZipCodeStatus: Status.NONE,
  uploadFileStatus: Status.NONE,
  getAdsStatus: Status.NONE,
};

////////////////////////////////////////////////////////////////////////
/////////////////////////// Get Categories /////////////////////////////
////////////////////////////////////////////////////////////////////////
const getGlobalDataRequest = (state) => ({
  ...state,
  getGlobalDataStatus: Status.REQUEST,
});

const getGlobalDataSuccess = (state, action) => ({
  ...state,
  categories: action.payload.categories,
  fee: action.payload.fee,
  getGlobalDataStatus: Status.SUCCESS,
});

const getGlobalDataFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getGlobalDataStatus: Status.FAILURE,
});

////////////////////////////////////////////////////////////////////////
//////////////////////////// Get GeoData ///////////////////////////////
////////////////////////////////////////////////////////////////////////
const getGeoDataRequest = (state) => ({
  ...state,
  getGeoDataStatus: Status.REQUEST,
});

const getGeoDataSuccess = (state, action) => ({
  ...state,
  geoData: action.payload,
  getGeoDataStatus: Status.SUCCESS,
});

const getGeoDataFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getGeoDataStatus: Status.FAILURE,
});

////////////////////////////////////////////////////////////////////////
//////////////////////////// Get Zipcode ///////////////////////////////
////////////////////////////////////////////////////////////////////////
const getZipCodeRequest = (state) => ({
  ...state,
  getZipCodeStatus: Status.REQUEST,
});

const getZipCodeSuccess = (state, action) => ({
  ...state,
  zipcode: action.payload,
  getZipCodeStatus: Status.SUCCESS,
});

const getZipCodeFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getZipCodeStatus: Status.FAILURE,
});

////////////////////////////////////////////////////////////////////////
/////////////////////////// Get Arrive Time ////////////////////////////
////////////////////////////////////////////////////////////////////////
const getArriveTimeRequest = (state) => ({
  ...state,
  getArriveTimeStatus: Status.REQUEST,
});

const getArriveTimeSuccess = (state, action) => ({
  ...state,
  arrivedTime: action.payload,
  getArriveTimeStatus: Status.SUCCESS,
});

const getArriveTimeFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getArriveTimeStatus: Status.FAILURE,
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// Upload File //////////////////////////////
////////////////////////////////////////////////////////////////////////
const uploadFileRequest = (state) => ({
  ...state,
  uploadFileStatus: Status.REQUEST,
});

const uploadFileSuccess = (state, action) => ({
  ...state,
  uploadedUrl: action.payload.url,
  uploadedMediaType: action.payload.type,
  uploadFileStatus: Status.SUCCESS,
});

const uploadFileFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  uploadFileStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
///////////////////////// Get Ads ///////////////////////////////////
/////////////////////////////////////////////////////////////////////
const getAdsRequest = (state) => ({
  ...state,
  getAdsStatus: Status.REQUEST,
});

const getAdsSuccess = (state, action) => ({
  ...state,
  selectedAds: action.payload,
  getAdsStatus: Status.SUCCESS,
  adsPlaying: AdsStatus.PLAYING
});

const getAdsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getAdsStatus: Status.FAILURE,
  adsPlaying: AdsStatus.CLOSE
});

/////////////////////////////////////////////////////////////////////
////////////////////// Add Ads Click ////////////////////////////////
/////////////////////////////////////////////////////////////////////
const addAdsClickRequest = (state) => ({
  ...state,
  adsClickStatus: Status.REQUEST,
});

const addAdsClickSuccess = (state, action) => ({
  ...state,
  adsClicked: true,
  adsClickStatus: Status.SUCCESS,
  adsPlaying: AdsStatus.CLICK
});

const addAdsClickFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  adsClickStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
////////////////////// Add Ads Show Click ///////////////////////////
/////////////////////////////////////////////////////////////////////
const addAdsShowRequest = (state) => ({
  ...state,
  adsShowStatus: Status.REQUEST,
});

const addAdsShowSuccess = (state, action) => ({
  ...state,
  adsShowStatus: Status.SUCCESS,
});

const addAdsShowFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  adsShowStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
/////////////////////////// Close Ads ///////////////////////////////
/////////////////////////////////////////////////////////////////////
const closeAdsRequest = (state) => ({
  ...state,
  closeAdsStatus: Status.REQUEST,
});

const closeAdsSuccess = (state, action) => ({
  ...state,
  closeAdsStatus: Status.SUCCESS,
  adsPlaying: AdsStatus.CLOSE
});

const closeAdsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  closeAdsStatus: Status.FAILURE,
});

/////////////////////////////////////////////////////////////////////
/////////////////////////// Set Years ///////////////////////////////
/////////////////////////////////////////////////////////////////////
const setYears = (state, action) => ({
  ...state,
  years: action.years,
});

/////////////////////////////////////////////////////////////////////
///////////////////////// Reset Global //////////////////////////////
/////////////////////////////////////////////////////////////////////
const resetGlobal = (state, action) => {
  state.selectedAds = null;
  state.categories = [];
  state.fee = 0;

  state.geoData = {};
  state.arrivedTime = 0;
  state.zipcode = '';
  state.uploadedUrl = '';
  state.errorMessage = "";
  
	state.getGlobalDataStatus = Status.NONE;
  state.getGeoDataStatus = Status.NONE;
  state.getArriveTimeStatus = Status.NONE;
  state.getZipCodeStatus = Status.NONE;
  state.uploadFileStatus = Status.NONE;
  state.getAdsStatus = Status.NONE;

  return {
    ...state,
  };
};

const actionHandlers = {
  [Types.GET_GLOBAL_DATA_REQUEST]: getGlobalDataRequest,
  [Types.GET_GLOBAL_DATA_SUCCESS]: getGlobalDataSuccess,
  [Types.GET_GLOBAL_DATA_FAILURE]: getGlobalDataFailure,

  [Types.GET_GEODATA_REQUEST]: getGeoDataRequest,
  [Types.GET_GEODATA_SUCCESS]: getGeoDataSuccess,
  [Types.GET_GEODATA_FAILURE]: getGeoDataFailure,

  [Types.GET_ARRIVE_TIME_REQUEST]: getArriveTimeRequest,
  [Types.GET_ARRIVE_TIME_SUCCESS]: getArriveTimeSuccess,
  [Types.GET_ARRIVE_TIME_FAILURE]: getArriveTimeFailure,

  [Types.GET_ZIP_CODE_REQUEST]: getZipCodeRequest,
  [Types.GET_ZIP_CODE_SUCCESS]: getZipCodeSuccess,
  [Types.GET_ZIP_CODE_FAILURE]: getZipCodeFailure,

  [Types.UPLOAD_ATTACH_FILE_REQUEST]: uploadFileRequest,
  [Types.UPLOAD_ATTACH_FILE_SUCCESS]: uploadFileSuccess,
  [Types.UPLOAD_ATTACH_FILE_FAILURE]: uploadFileFailure,

  [Types.GET_ADS_REQUEST]: getAdsRequest,
  [Types.GET_ADS_SUCCESS]: getAdsSuccess,
  [Types.GET_ADS_FAILURE]: getAdsFailure,

  [Types.ADD_ADS_CLICK_REQUEST]: addAdsClickRequest,
  [Types.ADD_ADS_CLICK_SUCCESS]: addAdsClickSuccess,
  [Types.ADD_ADS_CLICK_FAILURE]: addAdsClickFailure,

  [Types.ADD_ADS_SHOW_REQUEST]: addAdsShowRequest,
  [Types.ADD_ADS_SHOW_SUCCESS]: addAdsShowSuccess,
  [Types.ADD_ADS_SHOW_FAILURE]: addAdsShowFailure,

  [Types.CLOSE_ADS_REQUEST]: closeAdsRequest,
  [Types.CLOSE_ADS_SUCCESS]: closeAdsSuccess,
  [Types.CLOSE_ADS_FAILURE]: closeAdsFailure,

  [Types.SET_YEARS]: setYears, 
  [Types.RESET_GLOBAL]: resetGlobal,
};

export default createReducer(initialState, actionHandlers);
