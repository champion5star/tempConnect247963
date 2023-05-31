import { Platform } from 'react-native';
import Fonts from './Fonts'

const Styles = {
  errorText: {
    textAlign: 'center',
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    color: '#fc3434',
    fontSize: 13,
    marginTop: 10,
  },

  formErrorText: {
    textAlign: 'left',
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
    color: '#fc3434',
    fontSize: 11,
    marginTop: 0,
  },

  adBanner: {
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    flex: 0,
    justifyContent: 'center',
    alignContent: 'center',
    zIndex: 100,
  },

  bottomSheetContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 10,
  }
};

export default Styles;
