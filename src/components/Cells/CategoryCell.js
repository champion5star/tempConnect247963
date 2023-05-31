import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Fonts from '../../theme/Fonts'
import SubCategoryCell from './SubCategoryCell';

export default class CategoryCell extends React.Component {
  	render() {
		const {data, selected, onChoose} = this.props;
    	return (
			<View style={styles.container}>
				<Text style={styles.headerText}>{data.name}</Text>
				<View style={styles.contentView}>
					{
						data.subCategories.map((c, i) =>
							<SubCategoryCell 
								key={i.toString()}
								category={c}
								selected={selected}
								isTouchable={true}
								onChoose={onChoose}
							/>
						)
					}
				</View>
			</View>	    
    	);
  	}
}

const styles = StyleSheet.create({
	container: { 
        marginHorizontal: 20,
        paddingBottom: 20,
	},

	headerText: {
		fontFamily: Fonts.bold,
		fontSize: 18,
		marginBottom: 15,
	},

	contentView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
});