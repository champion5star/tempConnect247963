import {
  put, call, takeLatest, select,
} from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import Messages from '../theme/Messages'

const {
  loginUser,
  loginWithSocial,
  registerCustomer,
  registerProvider,
  checkEmail,
  createUser,
  forgotPassword,
  verifyCodePassword,
  resetPassword,
  changePassword,
  getUser,
  getTransactions,
  withdrawWithPaypal,
  withdrawWithBank,
  deposit,
  getPaypalClientToken,
  processPaypalDeposit,
  getNearbyProviders,
  updateCustomer,
  updateProvider,
  updateInfoCubic,
  getInfoCubicPackages,
  changeSubscription,
  buyCredit,
  sendBenefit,
  searchEmployees,
  searchEmployers,
} = api;

////////////////////////////////////////////////////////////////////////
/////////////////////////// Get Current User ///////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetCurrentUser(action) {
  yield put({ type: Types.GET_CURRENT_USER_REQUEST });
  try {
    yield put({ type: Types.GET_CURRENT_USER_SUCCESS });
  } catch (error) {
    yield put({ type: Types.GET_CURRENT_USER_FAILURE, error: error.message });
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////////// Login User ///////////////////////////////
////////////////////////////////////////////////////////////////////////
function* LoginUser(action) {
  yield put({ type: Types.LOGIN_REQUEST });
  try {
    const res = yield call(loginUser, action.email, action.password, action.player_id);
    if (res.result) {
      yield put({ type: Types.LOGIN_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.LOGIN_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.LOGIN_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////// Login With Social ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* LoginWithSocial(action) {
  yield put({ type: Types.LOGIN_WITH_SOCIAL_REQUEST });
  try {
    const res = yield call(loginWithSocial, action.user, action.player_id);
    if (res.result) {
      yield put({ type: Types.LOGIN_WITH_SOCIAL_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.LOGIN_WITH_SOCIAL_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.LOGIN_WITH_SOCIAL_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Check Email ////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* CheckEmail(action) {
  yield put({ type: Types.CHECK_EMAIL_REQUEST });
  try {
    const res = yield call(checkEmail, action.email);
    if (res.result) {
      yield put({ type: Types.CHECK_EMAIL_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.CHECK_EMAIL_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.CHECK_EMAIL_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Restore User ///////////////////////////////
////////////////////////////////////////////////////////////////////////
function* RestoreUser(action) {
  yield put({ type: Types.RESTORE_USER_REQUEST });
  try {
    const res = yield call(getUser, action.user_id);
    if (res.result) {
      yield put({ type: Types.RESTORE_USER_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.RESTORE_USER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.RESTORE_USER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////// Register Customer ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* RegisterCustomer(action) {
  yield put({ type: Types.REGISTER_CUSTOMER_REQUEST });
  try {
    const res = yield call(registerCustomer, action.user);
    if (res.result) {
      yield put({ type: Types.REGISTER_CUSTOMER_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.REGISTER_CUSTOMER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.REGISTER_CUSTOMER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////// Register Provider ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* RegisterProvider(action) {
  yield put({ type: Types.REGISTER_PROVIDER_REQUEST });
  try {
    const res = yield call(registerProvider, action.user);
    if (res.result) {
      yield put({ type: Types.REGISTER_PROVIDER_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.REGISTER_PROVIDER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.REGISTER_PROVIDER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Create User ///////////////////////////////
////////////////////////////////////////////////////////////////////////
function* CreateUser(action) {
  yield put({ type: Types.CREATE_USER_REQUEST });
  try {
    const res = yield call(createUser, action.user, action.player_id);
    if (res.result) {
      yield put({ type: Types.CREATE_USER_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.CREATE_USER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.CREATE_USER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////// Forgot Password /////////////////////////////
////////////////////////////////////////////////////////////////////////
function* ForgotPassword(action) {
  yield put({ type: Types.FORGOT_PASSWORD_REQUEST });
  try {
    const res = yield call(forgotPassword, action.email);
    if (res.result) {
      yield put({ type: Types.FORGOT_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.FORGOT_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.FORGOT_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////// Verify Code Password //////////////////////////
////////////////////////////////////////////////////////////////////////
function* VerifyCodePassword(action) {
  yield put({ type: Types.VERIFY_CODE_PASSWORD_REQUEST });
  try {
    const res = yield call(verifyCodePassword, action.email, action.code);
    if (res.result) {
      yield put({ type: Types.VERIFY_CODE_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.VERIFY_CODE_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.VERIFY_CODE_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Reset Password /////////////////////////////
////////////////////////////////////////////////////////////////////////
function* ResetPassword(action) {
  yield put({ type: Types.RESET_PASSWORD_REQUEST });
  try {
    const res = yield call(resetPassword, action.email, action.password);
    if (res.result) {
      yield put({ type: Types.RESET_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.RESET_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.RESET_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Change Password ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* ChangePassword(action) {
  yield put({ type: Types.CHANGE_PASSWORD_REQUEST });
  try {
    const res = yield call(changePassword, action.user_id, action.old_password, action.new_password);
    if (res.result) {
      yield put({ type: Types.CHANGE_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.CHANGE_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.CHANGE_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////// Get User ////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetUser(action) {
  yield put({ type: Types.GET_USER_REQUEST });
  try {
    const res = yield call(getUser, action.user_id, action.is_update);
    if (res.result) {
      yield put({ type: Types.GET_USER_SUCCESS, payload: res, is_update: action.is_update});
    } else {
      yield put({ type: Types.GET_USER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_USER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Get Transaction ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetTransactions(action) {
  yield put({ type: Types.GET_TRANSACTIONS_REQUEST });
  try {
    const res = yield call(getTransactions, action.user_id);
    if (res.result) {
      yield put({ type: Types.GET_TRANSACTIONS_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.GET_TRANSACTIONS_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_TRANSACTIONS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  };
}

////////////////////////////////////////////////////////////////////////
///////////////////////// Withdraw With Paypal /////////////////////////
////////////////////////////////////////////////////////////////////////
function* WithdrawWithPaypal(action) {
  yield put({ type: Types.WITHDRAW_WITH_PAYPAL_REQUEST });
  try {
    const res = yield call(
      withdrawWithPaypal, 
      action.user_id,
      action.paypal,
      action.amount,
    );

    if (res.result) {
      yield put({ type: Types.WITHDRAW_WITH_PAYPAL_SUCCESS, payload: res, amount: action.amount });
    } else {
      yield put({ type: Types.WITHDRAW_WITH_PAYPAL_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.WITHDRAW_WITH_PAYPAL_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  };
}

////////////////////////////////////////////////////////////////////////
///////////////////////// Withdraw With Bank ///////////////////////////
////////////////////////////////////////////////////////////////////////
function* WithdrawWithBank(action) {
  yield put({ type: Types.WITHDRAW_WITH_BANK_REQUEST });
  try {
    const res = yield call(
      withdrawWithBank, 
      action.user_id,
      action.routing_number,
      action.account_number,
      action.card_number,
      action.expire_date,
      action.cvc,
      action.amount,
    );

    if (res.result) {
      yield put({ type: Types.WITHDRAW_WITH_BANK_SUCCESS, payload: res, amount: action.amount});
    } else {
      yield put({ type: Types.WITHDRAW_WITH_BANK_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.WITHDRAW_WITH_BANK_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  };
}

////////////////////////////////////////////////////////////////////////
/////////////////////////////// Deposit ////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* Deposit(action) {
  yield put({ type: Types.DEPOSIT_REQUEST });
  try {
    const res = yield call(deposit, action.data);
    if (res.result) {
      yield put({ type: Types.DEPOSIT_SUCCESS, payload: res.user});
    } else {
      yield put({ type: Types.DEPOSIT_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.DEPOSIT_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  };
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Get Paypal Token //////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetPaypalClientToken(action) {
  yield put({ type: Types.GET_PAYPAL_CLIENT_TOKEN_REQUEST });
  try {
    const res = yield call(getPaypalClientToken, action.data);
    if (res.result) {
      yield put({ type: Types.GET_PAYPAL_CLIENT_TOKEN_SUCCESS, payload: res.token});
    } else {
      var error = "";
      if (res.error && res.error.name) {
        error = res.error.name;
      }
      yield put({ type: Types.GET_PAYPAL_CLIENT_TOKEN_FAILURE, error: error });
    }    
  } 
  catch (error) {
    yield put({ type: Types.GET_PAYPAL_CLIENT_TOKEN_FAILURE, error: Messages.NetWorkError });
  };
}

////////////////////////////////////////////////////////////////////////
//////////////////////// Process Paypal Deposit ////////////////////////
////////////////////////////////////////////////////////////////////////
function* ProcessPaypalDeposit(action) {
  yield put({ type: Types.PROCESS_PAYPAL_DEPOSIT_REQUEST });
  try {
    const res = yield call(processPaypalDeposit, action.data);
    if (res.result) {
      yield put({ type: Types.PROCESS_PAYPAL_DEPOSIT_SUCCESS, payload: res.user});
    } else {
      yield put({ type: Types.PROCESS_PAYPAL_DEPOSIT_FAILURE, error: res.error.name });      
    }
  } catch (error) {
    yield put({ type: Types.PROCESS_PAYPAL_DEPOSIT_FAILURE, error: Messages.NetWorkError });
  };
}

////////////////////////////////////////////////////////////////////////
/////////////////////// Get Nearby By Providers ////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetNearyByProviders(action) {
  yield put({ type: Types.GET_NEARBY_PROVIDERS_REQUEST });
  try {
    const res = yield call(
      getNearbyProviders, 
      action.lat,
      action.lng,
      action.distance,
      action.service_id
    );
    if (res.result) {
      yield put({ type: Types.GET_NEARBY_PROVIDERS_SUCCESS, payload: res.providers });
    } else {
      yield put({ type: Types.GET_NEARBY_PROVIDERS_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_NEARBY_PROVIDERS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  };
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Update Customer ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* UpdateCustomer(action) {
  yield put({ type: Types.UPDATE_CUSTOMER_REQUEST });
  try {
    const res = yield call(updateCustomer, action.user);
    if (res.result) {
      yield put({ type: Types.UPDATE_CUSTOMER_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.UPDATE_CUSTOMER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.UPDATE_CUSTOMER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Update Provider ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* UpdateProvider(action) {
  yield put({ type: Types.UPDATE_PROVIDER_REQUEST });
  try {
    const res = yield call(updateProvider, action.user);
    if (res.result) {
      yield put({ type: Types.UPDATE_PROVIDER_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.UPDATE_PROVIDER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.UPDATE_PROVIDER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////// Update Info Cubic ///////////////////////////
////////////////////////////////////////////////////////////////////////
function* UpdateInfoCubic(action) {
  yield put({ type: Types.UPDATE_INFOCUBIC_REQUEST });
  try {
    const res = yield call(updateInfoCubic, action.data);
    if (res.result) {
      yield put({ type: Types.UPDATE_INFOCUBIC_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.UPDATE_INFOCUBIC_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.UPDATE_INFOCUBIC_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////// Get Infocubic Packages ////////////////////////
////////////////////////////////////////////////////////////////////////
function* GetInfoCubicPackages(action) {
  yield put({ type: Types.GET_INFOCUBIC_PACKAGES_REQUEST });
  try {
    const res = yield call(getInfoCubicPackages, action.data);
    if (res.result) {
      yield put({ type: Types.GET_INFOCUBIC_PACKAGES_SUCCESS, payload: res.packages });
    } else {
      yield put({ type: Types.GET_INFOCUBIC_PACKAGES_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_INFOCUBIC_PACKAGES_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

////////////////////////////////////////////////////////////////////////
///////////////////////// Change Subscription //////////////////////////
////////////////////////////////////////////////////////////////////////
function* ChangeSubscription(action) {
  yield put({ type: Types.CHANGE_SUBSCRIPTION_REQUEST });
  try {
    const res = yield call(changeSubscription, action.user_id, action.level, action.subscription);
    if (res.result) {
      yield put({ type: Types.CHANGE_SUBSCRIPTION_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.CHANGE_SUBSCRIPTION_FAILURE, error: res.error });      
    }
  } catch (error) {
    console.log(error);
    yield put({ type: Types.CHANGE_SUBSCRIPTION_FAILURE, error: Messages.NetWorkError });
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Buy Credit ////////////////////////////////
////////////////////////////////////////////////////////////////////////
function* BuyCredit(action) {
  yield put({ type: Types.BUY_CREDIT_REQUEST });
  try {
    const res = yield call(buyCredit, action.data);
    if (res.result) {
      yield put({ type: Types.BUY_CREDIT_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.BUY_CREDIT_FAILURE, error: res.error });      
    }
  } catch (error) {
    console.log(error);
    yield put({ type: Types.BUY_CREDIT_FAILURE, error: Messages.NetWorkError });
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////////// Send Benefit ///////////////////////////////
////////////////////////////////////////////////////////////////////////
function* SendBenefit(action) {
  yield put({ type: Types.SEND_BENEFIT_REQUEST });
  try {
    const res = yield call(sendBenefit, action.data);
    if (res.result) {
      yield put({ type: Types.SEND_BENEFIT_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.SEND_BENEFIT_FAILURE, error: res.error });      
    }
  } catch (error) {
    console.log(error);
    yield put({ type: Types.SEND_BENEFIT_FAILURE, error: Messages.NetWorkError });
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////// Search Employees ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* SearchEmployees(action) {
  yield put({ type: Types.SEARCH_EMPLOYEES_REQUEST });
  try {
    const res = yield call(searchEmployees, action.data);
    if (res.result) {
      yield put({ type: Types.SEARCH_EMPLOYEES_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.SEARCH_EMPLOYEES_FAILURE, error: res.error });      
    }
  } catch (error) {
    console.log(error);
    yield put({ type: Types.SEARCH_EMPLOYEES_FAILURE, error: Messages.NetWorkError });
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////// Search Employers ////////////////////////////
////////////////////////////////////////////////////////////////////////
function* SearchEmployers(action) {
  yield put({ type: Types.SEARCH_EMPLOYERS_REQUEST });
  try {
    const res = yield call(searchEmployers, action.data);
    console.log("res: ", res);
    if (res.result) {
      yield put({ type: Types.SEARCH_EMPLOYERS_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.SEARCH_EMPLOYERS_FAILURE, error: res.error });      
    }
  } catch (error) {
    console.log(error);
    yield put({ type: Types.SEARCH_EMPLOYERS_FAILURE, error: Messages.NetWorkError });
  }
}

export default [
  takeLatest(Types.GET_CURRENT_USER, GetCurrentUser),
  takeLatest(Types.LOGIN_USER, LoginUser),
  takeLatest(Types.LOGIN_WITH_SOCIAL, LoginWithSocial),
  takeLatest(Types.CHECK_EMAIL, CheckEmail),
  takeLatest(Types.RESTORE_USER, RestoreUser),  
  takeLatest(Types.REGISTER_CUSTOMER, RegisterCustomer),  
  takeLatest(Types.REGISTER_PROVIDER, RegisterProvider),
  takeLatest(Types.CREATE_USER, CreateUser),
  takeLatest(Types.FORGOT_PASSWORD, ForgotPassword),
  takeLatest(Types.VERIFY_CODE_PASSWORD, VerifyCodePassword),
  takeLatest(Types.RESET_PASSWORD, ResetPassword),
  takeLatest(Types.CHANGE_PASSWORD, ChangePassword),
  takeLatest(Types.GET_USER, GetUser),
  takeLatest(Types.GET_TRANSACTIONS, GetTransactions),
  takeLatest(Types.WITHDRAW_WITH_PAYPAL, WithdrawWithPaypal),
  takeLatest(Types.WITHDRAW_WITH_BANK, WithdrawWithBank),
  takeLatest(Types.DEPOSIT, Deposit),
  takeLatest(Types.GET_PAYPAL_CLIENT_TOKEN, GetPaypalClientToken),
  takeLatest(Types.PROCESS_PAYPAL_DEPOSIT, ProcessPaypalDeposit),
  takeLatest(Types.GET_NEARBY_PROVIDERS, GetNearyByProviders),
  takeLatest(Types.UPDATE_CUSTOMER, UpdateCustomer),
  takeLatest(Types.UPDATE_PROVIDER, UpdateProvider),
  takeLatest(Types.UPDATE_INFOCUBIC, UpdateInfoCubic),  
  takeLatest(Types.GET_INFOCUBIC_PACKAGES, GetInfoCubicPackages),  
  takeLatest(Types.CHANGE_SUBSCRIPTION, ChangeSubscription),
  takeLatest(Types.BUY_CREDIT, BuyCredit),
  takeLatest(Types.SEND_BENEFIT, SendBenefit),
  takeLatest(Types.SEARCH_EMPLOYEES, SearchEmployees),
  takeLatest(Types.SEARCH_EMPLOYERS, SearchEmployers),
];
