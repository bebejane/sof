import { StyleSheet, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '@/styles/theme';
import { useEffect, useRef, useState } from 'react';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

type Props = {
	children?: any;
	maxHeight?: number;
};

export default function ReadMoreContent({ children, maxHeight = 150 }: Props) {
	const [height, setHeight] = useState<number | null>(null);
	const heightAnimation = useSharedValue(maxHeight);
	const [open, setOpen] = useState(false);
	const ref = useRef<View>(null);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: withTiming(heightAnimation.value, {
				duration: 350,
				easing: Easing.bezier(0.25, 0.1, 0.25, 1),
			}),
		};
	});

	useEffect(() => {
		heightAnimation.value = open && height !== null ? height : maxHeight;
	}, [open, height]);

	return (
		<>
			<Animated.View
				ref={ref}
				style={[s.container, height !== null && animatedStyle]}
				onLayout={(e) => {
					if (height !== null) return;
					setHeight(e.nativeEvent.layout.height);
				}}
			>
				{children}
			</Animated.View>
			<LinearGradient
				style={s.button}
				colors={['rgba(255,255,255,0)', Theme.color.white]}
				start={[0, 0]}
				end={[0, 0.6]}
			>
				<Ionicons
					name={open ? 'chevron-up' : 'chevron-down'}
					size={30}
					color={Theme.color.black}
					onPress={() => setOpen(!open)}
				/>
			</LinearGradient>
		</>
	);
}

const s = StyleSheet.create({
	container: {
		width: Theme.pageWidth,
		overflow: 'hidden',
		marginBottom: Theme.margin,
		paddingBottom: Theme.padding,
	},
	button: {
		bottom: 0,
		width: '100%',
		height: 80,
		marginTop: -80,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-end',
		zIndex: 2,
	},
});
