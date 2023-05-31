import { Platform } from 'react-native';
import { url } from '../constants';
import { GOOGLE_API_KEY } from '../constants.js'
import { filterFileUri, filterFileName } from '../functions';
import * as Storage from '../services/Storage';

////////////////////////////////////////////////////////////////////////
//////////////////////////// Get Global Data ///////////////////////////
////////////////////////////////////////////////////////////////////////
export const getGlobalData = () => {
  const method = 'POST';
  const request_url = `${url}/global/get_data`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({});

  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////
//////////////////////////// Get Arrive Time ///////////////////////////
////////////////////////////////////////////////////////////////////////
export const getArriveTime = (lat1, lng1, lat2, lng2) => {
	const params = "origins=" + lat1 + "," + lng1 + "&destinations=" + lat2 + "," + lng2 + "&key=AIzaSyCGJg6E9WkiiIbbOhAWw_A0wSMS3YKaNBs";
	var url = "https://maps.googleapis.com/maps/api/distancematrix/json?" + params;
	return fetch(url)
	.then((response) => response.json())
	.then((responseJson) => {
		return responseJson;
	});
}

////////////////////////////////////////////////////////////////////////
///////////////////////////// Get Geo Data /////////////////////////////
////////////////////////////////////////////////////////////////////////
export const getGeoData = (address) => {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + GOOGLE_API_KEY;
	return fetch(url)
	.then((response) => response.json())
	.then((responseJson) => {
	    if (responseJson.results && responseJson.results.length > 0) {
	        let item = responseJson.results[0];

	        let lat = item.geometry.location.lat;
	        let lng = item.geometry.location.lng;

	        // Get ZipCode.
	        url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=" + GOOGLE_API_KEY;
	        return fetch(url)
	        .then((response) => response.json())
	        .then((responseJson) => {
	            if (responseJson.results && responseJson.results.length > 0) {
	                let item = responseJson.results[0];
	                var zipcode = '';
					var city = '';
					var state = '';
					var county = '';
					var country = '';
					var street_number = '';
					var route = '';

	                for (var i = 0; i < item.address_components.length; i++) {
						const r = item.address_components[i];
						const types = r.types;

						if(types.indexOf('street_number') >= 0){
	                        street_number = r.long_name;
	                    }
						if(types.indexOf('route') >= 0){
	                        route = r.long_name;
	                    }
	                    if(types.indexOf('postal_code') >= 0){
	                        zipcode = r.long_name;
	                    }
						if(types.indexOf('country') >= 0){
	                        country = r.short_name;
	                    }
						if(types.indexOf('administrative_area_level_1') >= 0){
	                        state = r.short_name;
	                    }
						if(types.indexOf('administrative_area_level_2') >= 0){
	                        county = r.short_name;
	                    }
						if(types.indexOf('locality') >= 0 || types.indexOf('sublocality') >= 0){
	                        city = r.short_name;
	                    }
	                }
	                return {
	                	result: true,
	                    lat,
	                    lng,
						street_number,
						route,
						city,
						state,
						county,
						country,
						zipcode,
	                };
	            } else {
	            	return {
	            		result: true,
	                    lat,
	                    lng,
	                    zipcode: '',
	                };
	            }
	        })
	        .catch((error) => {
	          return error;
	        });
	    } else {
	    	return responseJson.status;
	    }
	})
	.catch((error) => {
	  return error;
	});
};

////////////////////////////////////////////////////////////////////////
///////////////////////////// Get Zip Code /////////////////////////////
////////////////////////////////////////////////////////////////////////
export const getZipCode = (lat, lng) => {
	const url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=" + GOOGLE_API_KEY;
	return fetch(url)
	.then((response) => response.json())
	.then((responseJson) => {
		if (responseJson.results && responseJson.results.length > 0) {
			let item = responseJson.results[0];
			var zipcode = '';
			for (var i = 0; i < item.address_components.length; i++) {
				if(item.address_components[i].types[0] == 'postal_code'){
					zipcode = item.address_components[i].long_name;
					break;
				}
			}
			return {
				result: true,
				zipcode
			};
		} else {
			return {
				result: true,
				zipcode: '',
			};
		}
	})
	.catch((error) => {
		return error;
	});
};

////////////////////////////////////////////////////////////////////////
///////////////////////////// Upload File //////////////////////////////
////////////////////////////////////////////////////////////////////////
export const uploadFile = (file) => {
	const formData = new FormData();

	const fileType = file.type ? file.type : 'image/jpeg';
	const filename = filterFileName(file, Platform.OS);
	const fileUri = filterFileUri(file.uri, Platform.OS);

	formData.append("file", {
		name: filename,
		type: fileType,
		uri: fileUri
	});

	const request_url = `${url}/global/upload_file`
	return fetch(request_url, {
		method: "POST",
		body: formData
	})
  	.then(response => response.json())
};

////////////////////////////////////////////////////////////////////////
////////////////////////////// Get Ads /////////////////////////////////
////////////////////////////////////////////////////////////////////////
export const getAds = async (data) => {
	const method = 'POST';
	const request_url = `${url}/ads/get_nearby`;
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
/////////////////////////// Add Ads Click //////////////////////////////
////////////////////////////////////////////////////////////////////////
export const addAdsClick = async (id) => {
	const method = 'POST';
	const request_url = `${url}/ads/add_click`;
	const jwtToken = await Storage.TOKEN.get();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: jwtToken,
	}
	const body = JSON.stringify({
		id
	});

	return fetch(request_url, { method, body, headers})
		.then((res) => res.json());
};

////////////////////////////////////////////////////////////////////////
//////////////////////////// Add Ads Show //////////////////////////////
////////////////////////////////////////////////////////////////////////
export const addAdsShow = async (id) => {
	const method = 'POST';
	const request_url = `${url}/ads/add_show`;
	const jwtToken = await Storage.TOKEN.get();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: jwtToken,
	}
	const body = JSON.stringify({
		id
	});

	return fetch(request_url, { method, body, headers})
		.then((res) => res.json());
};
