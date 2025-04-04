import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Drawer } from 'expo-router/drawer';
import { Text, TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer';
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
} from 'react-native-reanimated';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RelativePathString, useRouter } from 'expo-router';
import StatusBar from '@/components/StatusBar';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import Theme from '@/styles/theme';
import useAppReady from '../lib/hooks/useAppReady';

export type MenuItem = {
	name: string;
	href: string;
	options: { drawerLabel?: string; title: string };
};

export type Group = { id: string; title: string; items: MenuItem[]; open: boolean };

const home: MenuItem = {
	href: '/',
	name: 'index',
	options: {
		title: 'Samtal om Frihet',
		drawerLabel: 'Hem',
	},
};

const groups: Group[] = [
	{
		id: 'my-change',
		title: 'Min förändring',
		items: [
			{
				href: '/my-goals',
				name: 'my-goals/index',
				options: {
					title: 'Mina målsättningar',
				},
			},
			{
				href: '/take-care-of-myself',
				name: 'take-care-of-myself/index',
				options: {
					title: 'Ta hand om mig',
				},
			},
			{
				href: '/home-assignment',
				name: 'home-assignment',
				options: {
					title: 'Hemuppgift',
				},
			},
			{
				href: '/assess-progress',
				name: 'assess-progress/index',
				options: {
					title: 'Skatta framgång',
				},
			},
		],
		open: true,
	},
	{
		id: 'handle-myself',
		title: 'Hantera tankar, känslor och beteenden',
		items: [
			{
				href: '/calming-tooling',
				name: 'calming-tooling',
				options: {
					title: 'Lugnande verktyg',
				},
			},
			{
				href: '/sound-exercises',
				name: 'sound-exercises/index',
				options: {
					title: 'Ljudövningar',
				},
			},
			{
				href: '/create-everyday-flow',
				name: 'create-everyday-flow/index',
				options: {
					title: 'Skapa vardagsflyt',
				},
			},
			{
				href: '/expand-life-space',
				name: 'expand-life-space',
				options: {
					title: 'Vidga livsutrymmet',
				},
			},
		],
		open: true,
	},
	{
		id: 'diary',
		title: 'Dagbok mellan samtal',
		items: [
			{
				href: '/sork',
				name: 'sork',
				options: {
					title: 'Sork',
				},
			},
			{
				href: '/emotional-diary',
				name: 'emotional-diary',
				options: {
					title: 'Enkel känslodagbok',
				},
			},
			{
				href: '/tolerance-window',
				name: 'tolerance-window',
				options: {
					title: 'Toleransfönster',
				},
			},
		],
		open: true,
	},
	{
		id: 'plan',
		title: 'Dagbok mellan samtal',
		items: [
			{
				href: '/maintenance-plan',
				name: 'maintenance-plan/index',
				options: {
					title: 'Vidmakthållandeplan',
				},
			},
		],
		open: true,
	},
].map((group) => ({
	...group,
	items: group.items.map((screen: MenuItem) => ({
		...screen,
		options: {
			...screen.options,
			drawerLabel: screen.options.drawerLabel ?? screen.options.title,
			popToTopOnBlur: true,
		},
	})),
}));

export default function Navigation() {
	useAppReady({ delay: 1500 });

	return (
		<SafeAreaProvider>
			<StatusBar />
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Drawer
					drawerContent={CustomDrawerContent}
					screenOptions={({ navigation }) => ({
						swipeEdgeWidth: Platform.OS === 'android' ? 0 : undefined,
						headerTintColor: Theme.color.green,
						headerStyle: s.headerContainer,
						headerTitleAlign: 'center',
						headerTitle: (props) => (
							<View style={s.headerTitleContainer}>
								<Text style={s.headerTitle}>{props.children}</Text>
							</View>
						),
						headerLeftContainerStyle: s.hamburgerContainer,
						headerLeft: (props) => (
							<TouchableOpacity onPress={() => navigation.toggleDrawer()} style={s.hamburger}>
								<Ionicons name='menu' size={30} color={Theme.color.white} />
							</TouchableOpacity>
						),
					})}
				>
					{groups
						.map(({ items }) => items)
						.flat()
						.map(({ href, name, options }) => (
							<Drawer.Screen
								key={href}
								name={name}
								options={{
									...options,
								}}
							/>
						))}
				</Drawer>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}

export function CustomDrawerContent(props: DrawerContentComponentProps) {
	const router = useRouter();

	return (
		<DrawerContentScrollView {...props} scrollEnabled={true}>
			{home && (
				<DrawerItem
					key={'home'}
					label={home?.options.drawerLabel ?? home?.options.title}
					style={s.item}
					activeTintColor={Theme.color.green}
					labelStyle={s.label}
					focused={props.state.routeNames[props.state.index] === 'index'}
					onPress={() => router.push('/')}
				/>
			)}
			{groups.map((g, i) => (
				<DrawerGroup
					key={i}
					{...g}
					active={props.state.routeNames[props.state.index]}
					onPress={(href: RelativePathString) => router.push(href)}
				/>
			))}
		</DrawerContentScrollView>
	);
}

type DrawerGroupProps = {
	title: string;
	items: any[];
	active: string;
	onPress: (name: RelativePathString) => void;
};

export function DrawerGroup({ title, items, active, onPress }: DrawerGroupProps) {
	const ref = useRef<View>(null);
	const [height, setHeight] = useState<number | null>(null);
	const heightAnimation = useSharedValue(0);
	const [open, setOpen] = useState(true);

	useLayoutEffect(() => {
		height === null && ref.current?.measure((x, y, w, h, e) => setHeight(h));
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: withTiming(heightAnimation.value, {
				duration: 350,
				easing: Easing.bezier(0.25, 0.1, 0.25, 1),
			}),
		};
	});

	useEffect(() => {
		heightAnimation.value = open && height !== null ? height : 0;
	}, [open, height]);

	return (
		<View key={title}>
			<TouchableOpacity onPress={() => setOpen(!open)} key={title}>
				<View style={s.dropdown}>
					<Text style={s.header}>{title}</Text>
					<Ionicons
						style={s.arrow}
						name={open ? 'chevron-down' : 'chevron-up'}
						size={16}
						color='black'
					/>
				</View>
			</TouchableOpacity>
			<Animated.View ref={ref} style={[s.items, height !== null && animatedStyle]}>
				{items.map(({ href, name, options }) => (
					<DrawerItem
						key={href}
						route={href}
						label={options.drawerLabel}
						style={s.item}
						activeTintColor={Theme.color.green}
						labelStyle={s.label}
						focused={name === active}
						onPress={() => onPress(href)}
					/>
				))}
			</Animated.View>
		</View>
	);
}

const s = StyleSheet.create({
	headerContainer: {
		backgroundColor: Theme.color.green,
		height: Platform.OS === 'ios' ? Constants.statusBarHeight + 60 : 80,
	},
	headerTitleContainer: {
		flex: 1,
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: Theme.fontSize.default,
		color: Theme.color.white,
		fontWeight: 600,
	},
	hamburgerContainer: {
		display: 'flex',
		alignItems: 'center',
		margin: 0,
		padding: 0,
	},
	hamburger: {
		marginLeft: Theme.padding,
	},
	dropdown: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
	header: {
		fontSize: 16,
		fontWeight: 600,
		marginBottom: 10,
		marginTop: 20,
		flex: 1,
	},
	arrow: {
		flex: 0,
	},
	label: {
		fontSize: 16,
		margin: 0,
		lineHeight: 20,
	},
	items: {
		overflow: 'hidden',
	},
	item: {
		justifyContent: 'center',
		borderRadius: 0,
		padding: 0,
		margin: 0,
	},
});
