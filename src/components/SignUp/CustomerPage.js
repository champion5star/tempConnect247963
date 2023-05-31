import React from 'react';
import { StyleSheet, View, Keyboard, Image, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Label from './../Label'
import Button from './../Button'
import RoundButton from './../RoundButton'
import RoundTextInput from './../RoundTextInput'
import CheckBox from './../CheckBox'
import { USER_TYPE, ACCOUNT_TYPE, USER_LEVEL } from '../../constants'
import Colors from '../../theme/Colors'
import Images from '../../theme/Images'
import Fonts from '../../theme/Fonts';

export default class CustomerPage extends React.Component {

	render() {
		const { type } = this.props; 
		var buttonTitle = "Continue";
		if (type === USER_TYPE.CUSTOMER) {
			buttonTitle = "Register";
		}

		return (
			<KeyboardAwareScrollView enableOnAndroid={true}>
				<View>
					<View style={{ alignItems: 'center', marginBottom: 25 }}>
						<Image
							style={styles.logoImage}
							source={Images.logo}
						/>
					</View>

					<View style={styles.container}>
						{ type == USER_TYPE.CUSTOMER && this._renderAccountType() }
						{ this._renderInputForm() }

						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30, marginTop: 10 }}>
							<CheckBox
								value={this.props.agreeTerms}
								onChange={this.props.onChangeAgree}
							/>

							<Label title="I agree to the " style={{ marginLeft: 10 }} />
							<Button title="Terms of Use" bold={true} onPress={this.props.onTerms} />

						</View>

						<RoundButton
							title={buttonTitle}
							theme="white"
							style={{ marginBottom: 50 }}
							onPress={this.props.onRegister} />
					</View>
				</View>
			</KeyboardAwareScrollView>
		);
	}

	////////////////////////////////////////////////////////////////////////
	//////////////////////////// Account Type //////////////////////////////
	////////////////////////////////////////////////////////////////////////
	_renderAccountType() {
		const { accountType, onChangeAccountType } = this.props;
		return (
			<View style={styles.accountTypeContainer}>
				<TouchableOpacity 
					style={[styles.accountBtn, accountType == ACCOUNT_TYPE.PERSONAL ? styles.accountSelectBtn : {}]}
					onPress={() => onChangeAccountType(ACCOUNT_TYPE.PERSONAL)}
				>
					<Image 
						source={accountType == ACCOUNT_TYPE.PERSONAL ? Images.icon_personal_active : Images.icon_personal} 
						style={styles.accountIcon}
					/>
					<Text 
						style={[
							styles.accountText,
							accountType == ACCOUNT_TYPE.PERSONAL ? styles.accountActiveText : {}
						]}
					>Personal</Text>
				</TouchableOpacity>

				<TouchableOpacity 
					style={[styles.accountBtn, accountType == ACCOUNT_TYPE.COMPANY ? styles.accountSelectBtn : {}]}
					onPress={() => onChangeAccountType(ACCOUNT_TYPE.COMPANY)}
				>
					<Image 
						source={accountType == ACCOUNT_TYPE.COMPANY ? Images.icon_company_active : Images.icon_company} 
						style={styles.accountIcon} 
					/>
					<Text 
						style={[
							styles.accountText,
							accountType == ACCOUNT_TYPE.COMPANY ? styles.accountActiveText : {}
						]}
					>Company</Text>
				</TouchableOpacity>
			</View>
		)
	}

	////////////////////////////////////////////////////////////////////////
	///////////////////////////// Input Form ///////////////////////////////
	////////////////////////////////////////////////////////////////////////
	_renderInputForm() {
		const { user, type, accountType, isEmailEdiable } = this.props; 
		return (
			<View>
				{
					(accountType == ACCOUNT_TYPE.PERSONAL)
					? <View>
						<RoundTextInput
							placeholder="First name"
							type="text"
							value={user.firstName}
							errorMessage={user.firstNameError}
							maxLength={20}
							returnKeyType="next"
							onSubmitEditing={() => { this.lastNameInput.focus() }}
							onChangeText={(text) => this.props.onChangeUser("firstName", text)}
						/>

						<RoundTextInput
							placeholder="Last name"
							type="text"
							value={user.lastName}
							errorMessage={user.lastNameError}
							maxLength={20}
							returnKeyType="next"
							onSubmitEditing={() => { this.emailInput.focus() }}
							onRefInput={(input) => { this.lastNameInput = input }}
							onChangeText={(text) => this.props.onChangeUser("lastName", text)}
						/>
					</View>
					: <RoundTextInput
						placeholder="Company"
						type="text"
						value={user.company}
						errorMessage={user.companyError}
						maxLength={20}
						returnKeyType="next"
						onSubmitEditing={() => { this.emailInput.focus() }}
						onChangeText={(text) => this.props.onChangeUser("company", text)}
					/>
				}

				<RoundTextInput
					placeholder="Email Address"
					type="email"
					maxLength={30}
					editable={isEmailEdiable}
					placeholderTextColor={Colors.placeholderColor}
					value={user.email}
					errorMessage={user.emailError}
					returnKeyType="next"
					onSubmitEditing={() => { this.phoneInput.focus() }}
					onRefInput={(input) => { this.emailInput = input }}
					onChangeText={(text) => this.props.onChangeUser("email", text)}
				/>

				<RoundTextInput
					placeholder="Phone Number"
					type="phone"
					placeholderTextColor={Colors.placeholderColor}
					value={user.phone}
					errorMessage={user.phoneError}
					maxLength={20}
					returnKeyType="next"
					onSubmitEditing={() => { this.locationInput.focus() }}
					onRefInput={(input) => { this.phoneInput = input }}
					onChangeText={(text) => this.props.onChangeUser("phone", text)}
				/>

				<RoundTextInput
					placeholder="Address"
					type="address"
					placeholderTextColor={Colors.placeholderColor}
					value={user.locationText}
					errorMessage={user.locationError}
					returnKeyType={user.socialId == null ? "next" : "done"}
					onSubmitEditing={() => {
						if (user.socialId == null) {
							this.passwordInput.focus()
						} else {
							Keyboard.dismiss();
							this.props.onRegister();
						}
					}}
					onRefInput={(input) => { this.locationInput = input }}
					onSelectAddress={(address) => this.props.onChangeUser("location", address)}
					onChangeText={(text) => this.props.onChangeUser("locationText", text)}
				/>
				{
					user.socialId == null
						? <View>
							<RoundTextInput
								placeholder="Password"
								type="password"
								placeholderTextColor={Colors.placeholderColor}
								maxLength={30}
								value={user.password}
								errorMessage={user.passwordError}
								returnKeyType="next"
								onSubmitEditing={() => { this.confirmPasswordInput.focus() }}
								onRefInput={(input) => { this.passwordInput = input }}
								onChangeText={(text) => this.props.onChangeUser("password", text)}
							/>

							<RoundTextInput
								placeholder="Confirm Password"
								type="password"
								placeholderTextColor={Colors.placeholderColor}
								value={user.confirmPassword}
								errorMessage={user.confirmPasswordError}
								maxLength={30}
								returnKeyType="done"
								onRefInput={(input) => { this.confirmPasswordInput = input }}
								onSubmitEditing={() => {
									Keyboard.dismiss();
									this.props.onRegister()
								}}
								onChangeText={(text) => this.props.onChangeUser("confirmPassword", text)}
							/>
						</View>

						: null
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 35,
		paddingRight: 35,
		paddingTop: 20,
		paddingBottom: 20,
	},

	logoImage: {
		width: 170,
		height: 140,
		resizeMode: 'contain',
	},

	accountTypeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 25,
	},

	accountBtn: {
		borderWidth: 2,
		borderColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15,
		width: '48%',
		paddingVertical: 8,
	},

	accountSelectBtn: {
		backgroundColor: 'white',
	},

	accountIcon: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
		marginRight: 8,
	},

	accountText: {
		fontFamily: Fonts.bold,
		fontSize: 14,
		color: 'white',
		letterSpacing: 0.5,
	},

	accountActiveText: {
		color: Colors.appColor,
	},

	rowView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	}

});