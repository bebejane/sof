import { StyleSheet, ScrollView as ScrollViewElement } from 'react-native';
import Theme from '@/styles/theme';
import { Spacer } from './Spacer';
import { useEffect } from 'react';
import { useNavigation } from 'expo-router';

export const PageView = ({
	children,
	style,
	onFocus,
}: {
	children?: any;
	style?: any;
	onFocus?: () => void;
}) => {
	const navigation = useNavigation();

	useEffect(() => {
		return navigation.addListener('focus', () => onFocus?.());
	}, [navigation]);

	return (
		<ScrollViewElement style={[s.view, style]} automaticallyAdjustKeyboardInsets={true}>
			{children}
			<Spacer size='large' />
		</ScrollViewElement>
	);
};

const s = StyleSheet.create({
	view: {
		flex: 1,
		flexDirection: 'column',
		padding: Theme.padding,
		backgroundColor: Theme.color.white,
		width: Theme.screenWidth,
		height: Theme.screenHeight,
	},
});
