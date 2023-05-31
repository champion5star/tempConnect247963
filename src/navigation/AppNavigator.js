import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import SelectUserType from '../screens/Auth/SelectUserTypeScreen'
import SignUp2Screen from '../screens/Auth/SignUp2Screen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import VerificationCode from '../screens/Auth/VerificationCodeScreen';
import IDVerification from '../screens/Auth/IDVerificationScreen';
import ResetNewPassword from '../screens/Auth/ResetNewPasswordScreen';
import SignupInfoCubicScreen from '../screens/Auth/SignupInfoCubicScreen';

import Terms from '../screens/TermsScreen';
import Privacy from '../screens/PrivacyScreen';
import CategorySelectScreen from '../screens/CategorySelectScreen';
import ChangePassword from '../screens/ChangePasswordScreen';
import Notification from '../screens/NotificationScreen';

import MessageList from '../screens/Message/MessageListScreen';
import Chat from '../screens/Message/ChatSceen';
import FAQ from '../screens/FAQScreen';
import SideMenu from '../screens/SideMenu';

// Customer.
import CustomerMyProject from '../screens/Customer/CustomerMyProjectScreen'
import NewProject from '../screens/Customer/NewProjectScreen'
import DetailProject from '../screens/Customer/DetailProjectScreen'
import DetailProvider from '../screens/Customer/DetailProviderScreen'
import SearchEmployee from '../screens/Customer/SearchEmployeeScreen'
import DetailCustomer from '../screens/Customer/DetailCustomerScreen'

// Provider.
import ProviderHome from '../screens/Provider/ProviderHomeScreen'
import ProviderMyJob from '../screens/Provider/ProviderMyJobScreen'
import SearchEmployer from '../screens/Provider/SearchEmployerScreen';

import Pay from '../screens/Customer/PayScreen';
import Benefits from '../screens/BenefitsScreen';
import CustomerEditProfile from '../screens/Customer/CustomerEditProfileScreen';
import ProviderEditProfile from '../screens/Provider/ProviderEditProfileScreen';
import DepositPaymentMethod from '../screens/Customer/DepositPaymentMethodScreen';
import CardDeposit from '../screens/Customer/CardDepositScreen';
import PaypalDeposit from '../screens/Customer/PaypalDepositScreen';
import TransactionHistory from '../screens/Customer/TransactionHistoryScreen';

import ProviderEarnings from '../screens/Provider/ProviderEarningsScreen'
import PaymentMethod from '../screens/Provider/PaymentMethodScreen'
import PaypalWithdraw from '../screens/Provider/PaypalWithdrawScreen'
import BankWithdraw from '../screens/Provider/BankWithdrawScreen'
import InfoCubic from '../screens/InfoCubicScreen'
import Subscription from '../screens/SubscriptionScreen'
import PDFViewer from '../screens/Provider/PDFViewerScreen';

const options = { headerShown: false, gestureEnabled: false };
const options2 = { headerShown: false, gestureEnabled: true };

function CustomerDrawer() {
  return (
    <Drawer.Navigator 
      drawerType="slide" 
      drawerContent={(props) => <SideMenu {...props}/>}
      options={options}
    >
      <Drawer.Screen name="CustomerMyProject" component={CustomerMyProject} options={options2} />
      <Drawer.Screen name="SearchEmployee" component={SearchEmployee} options={options2} />
      <Drawer.Screen name="MessageList" component={MessageList} options={options2}/>
      <Drawer.Screen name="TransactionHistory" component={TransactionHistory} options={options2}/>
      <Drawer.Screen name="ChangePassword" component={ChangePassword} options={options2}/>
      <Drawer.Screen name="Notification" component={Notification} options={options2}/>
      <Drawer.Screen name="FAQ" component={FAQ} options={options2}/>
      <Drawer.Screen name="InfoCubic" component={InfoCubic} options={options2}/>
      <Stack.Screen name="Benefits" component={Benefits} options={options2}/>

    </Drawer.Navigator>
  );
}

function ProviderDrawer() {
  return (
    <Drawer.Navigator 
      drawerType="slide" 
      drawerContent={(props) => <SideMenu {...props}/>}
      options={options}
    >
      <Drawer.Screen name="ProviderHome" component={ProviderHome} options={options2}/>
      <Drawer.Screen name="ProviderMyJob" component={ProviderMyJob} options={options2}/>
      <Drawer.Screen name="SearchEmployer" component={SearchEmployer} options={options2}/>
      <Drawer.Screen name="MessageList" component={MessageList} options={options2}/>
      <Drawer.Screen name="ChangePassword" component={ChangePassword} options={options2}/>
      <Stack.Screen name="ProviderEarnings" component={ProviderEarnings} options={options2}/>
      <Drawer.Screen name="Notification" component={Notification} options={options2}/>
      <Drawer.Screen name="FAQ" component={FAQ} options={options2}/>
      <Stack.Screen name="Benefits" component={Benefits} options={options2}/>
    </Drawer.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={options}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={options}/>
        <Stack.Screen name="SignUp2" component={SignUp2Screen} options={options}/>
        <Stack.Screen name="SignupInfoCubic" component={SignupInfoCubicScreen} options={options}/>
        <Stack.Screen name="SelectUserType" component={SelectUserType} options={options}/>
        <Stack.Screen name="CategorySelect" component={CategorySelectScreen} options={options}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={options}/>
        <Stack.Screen name="Terms" component={Terms} options={options}/>
        <Stack.Screen name="Privacy" component={Privacy} options={options}/>
        <Stack.Screen name="IDVerification" component={IDVerification} options={options}/>
        <Stack.Screen name="VerificationCode" component={VerificationCode} options={options}/>
        <Stack.Screen name="ResetNewPassword" component={ResetNewPassword} options={options}/>
        <Stack.Screen name="NewProject" component={NewProject} options={options}/>
        <Stack.Screen name="DetailProject" component={DetailProject} options={options}/>
        <Stack.Screen name="Chat" component={Chat} options={options}/>
        <Stack.Screen name="BankWithdraw" component={BankWithdraw} options={options}/>
        <Stack.Screen name="PaypalWithdraw" component={PaypalWithdraw} options={options}/>
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} options={options}/>
        <Stack.Screen name="PaypalDeposit" component={PaypalDeposit} options={options}/>
        <Stack.Screen name="CardDeposit" component={CardDeposit} options={options}/>
        <Stack.Screen name="DepositPaymentMethod" component={DepositPaymentMethod} options={options}/>
        <Stack.Screen name="ProviderEditProfile" component={ProviderEditProfile} options={options}/>
        <Stack.Screen name="CustomerEditProfile" component={CustomerEditProfile} options={options}/>
        <Stack.Screen name="Pay" component={Pay} options={options}/>
        <Stack.Screen name="DetailProvider" component={DetailProvider} options={options}/>
        <Stack.Screen name="DetailCustomer" component={DetailCustomer} options={options}/>
        <Stack.Screen name="Subscription" component={Subscription} options={options}/>
        <Stack.Screen name="PDFViewer" component={PDFViewer} options={options}/>

        <Stack.Screen name="CustomerDrawer" component={CustomerDrawer} options={options}/>
        <Stack.Screen name="ProviderDrawer" component={ProviderDrawer} options={options}/>
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

export default AppNavigator;
