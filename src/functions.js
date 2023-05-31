import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { IMAGE_COMPRESS_QUALITY, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT } from './constants'
import NetInfo from "@react-native-community/netinfo";

export const compressImage = async (imageFile) => {
  if (Platform.OS === 'android') {
    image = await ImageResizer.createResizedImage(
      imageFile.uri,
      MAX_IMAGE_WIDTH,
      MAX_IMAGE_HEIGHT,
      'JPEG',
      IMAGE_COMPRESS_QUALITY,      
    );
  } else {
    image = await ImageResizer.createResizedImage(
      imageFile.uri,
      MAX_IMAGE_WIDTH,
      MAX_IMAGE_HEIGHT,
      'JPEG',
      IMAGE_COMPRESS_QUALITY,
      0,
      RNFS.TemporaryDirectoryPath
    );
    const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()}.jpg`;
    await RNFS.copyFile(image.uri, dest);
  }
  return image
}

export const makeRandomText = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const filterFileName = (file, platform) => {
  var filename = '';
  if (platform === 'ios') {
    filename = file.fileName ? file.fileName : makeRandomText(20) + ".jpg";
  } else {
    filename = file.name ? file.name : makeRandomText(20) + ".jpg";
  }
  return filename;
}

export const filterFileUri = (fileUri, platform) => {
  if (platform === "ios") {
    if (fileUri.indexOf('file://') === 0) {
      return fileUri.replace("file://", "");
    }
  } else {
    if (fileUri.indexOf('://') < 0) {
      return "file://" + fileUri;
    } 
  }

  return fileUri;
}

export const isValidEmail = (email) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email) === false) {
    return false;
  }
  return true;
}

export const kFormatter = (value) => {
  var suffixes = ["", "k", "m", "b","t"];
  var suffixNum = Math.floor((""+value).length/3);
  var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
  if (shortValue % 1 != 0) {
      shortValue = shortValue;
  }
  return shortValue+suffixes[suffixNum];
}

export const trimEllip = function (text, length) {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

/**
 * compares a
 * @param {Array<any>} arr array to uniq
 * @return {Array<any>}
 */
export const uniq = (arr) => [...new Set(arr)];

/**
 * fetch a json endpoint
 * @param  {...any} params fetch params
 */
export const jsonFetch = (...params) => fetch(...params)
  .then((res) => {
    if (res.status !== 204) {
      return res.json();
    }
    return null;
  })
  .then((data) => data);

/**
 * get headers for fetch request
 * @param {string} token auth token
 */
export const fetchHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
  "Accept-Encoding" : "gzip",

});

/**
 * marks badges as locked
 */
export const lockBadge = (userBadges = []) => (badge) => {
  if (userBadges.includes(badge._id)) {
    return badge;
  }
  return { ...badge, isLock: true };
};

/**
 * Get the emoji for the corresponding streak
 * @param {number} streak userStreak
 * @return streak emoji
 */
export const streakEmoji = (streak) => {
  if (!streak) return '👌';
  if (streak <= 5) return '👌';
  if (streak <= 15) return '🤙';
  if (streak <= 30) return '🔥';
  if (streak <= 45) return '💍';
  if (streak <= 45) return '💎';
  if (streak <= 45) return '🔮';
  return '🚨';
};

/**
 * Helper to user swipper scroll easily
 * @param {object} swiper swipper object
 * @param {number} from from scroll
 * @param {number} to target scroll
 */
export const swipperScrollTo = (swiper, from, to, animated = true) => {
  const change = to - from;
  if (change) return swiper.scrollBy(change, animated);
  return null;
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str string to capitalize
 */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Truncates an array
 * @param {string} str string to truncate
 * @param {number} max max allowed chars without truncation
 */
export const truncate = (str = '', max = 10) => (str.length <= max ? str : (`${str.slice(0, max - 3)}...`));

/**
 * Delays a promise execution
 * @param {number} ms delay time in Ms
 */
export const delay = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

export const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

export const filterOnlyDigits = (value) => {
  return value.replace(/\D/g, '');
};

export const checkInternetConnectivity = async () => {
  return NetInfo.fetch().then(state => {
    return state.isConnected
  });
};

export const getURLExtension = (url) => {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

export const filterSkills = (skills, definedList) => {
  var list = [];
  skills.forEach(s => {
    if (s.match(/^[0-9a-fA-F]{24}$/)) {
      definedList.forEach(item => {
        if (item._id == s) {
          list.push(item.name);
          return;
        }
      });
    }
    else {
      list.push(s);
    }
  });
  return list;
}

export const getDurationUnit =(duration, payType)=> {
  var durationUnit = "";
  if (payType == "Fixed") {
    if (duration > 1) {
      durationUnit = "Days";
    } 
    else {
      durationUnit = "Day";
    }
  }
  else {
    if (duration > 1) {
      durationUnit = "Hours";
    } 
    else {
      durationUnit = "Hour";
    }
  }

  return durationUnit;
}

export const calcDistance = (lat1, lon1, lat2, lon2, unit) => {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist.toFixed(1);
	}
}