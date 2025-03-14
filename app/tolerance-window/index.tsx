import { Loader, TextInput, PageView, Spacer, Text } from '@/components/ui';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Gradient from 'javascript-color-gradient';

import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View } from 'react-native';
import { useQuery } from '@/lib/client';
import { ToleranceWindowDocument } from '@/graphql';
import StructuredContent from '@/components/StructuredContent';
import React, { useState } from 'react';
import Theme from '@/styles/theme';

const sliderHeight = Theme.screenHeight / 2;
const levels = [
	{ header: 'Över', text: 'Stark rädsla, raseri' },
	{ header: 'Mitt i', text: 'I balans, fokuserad' },
	{ header: 'Under', text: 'Avsängd, bortdomnad' },
];

export default function ToleranceWindows() {
	const [selectedTool, setSelectedTool] = useState<string | null>(null);
	const [data, error, loading, retry] = useQuery<ToleranceWindowQuery>(ToleranceWindowDocument);
	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	const { sofToleranceWindow, allSofCalmingToolingTools: tools } = data;

	return (
		<PageView>
			<StructuredContent content={sofToleranceWindow?.intro} />
			<Spacer size='small' />
			{sofToleranceWindow?.inputs.map((input, i) => (
				<TextInput key={i} slug={input.slug} label={input.label} />
			))}
			<StructuredContent content={sofToleranceWindow?.introTools} />
			<Picker
				style={s.picker}
				itemStyle={s.pickerItem}
				numberOfLines={1}
				selectedValue={selectedTool}
				onValueChange={(itemValue, itemIndex) => setSelectedTool(itemValue)}
			>
				{tools.map(({ id, title }) => (
					<Picker.Item label={title} value={id} key={id} color={Theme.color.green} />
				))}
			</Picker>
			<Spacer />
			<ToleranceSlider />
		</PageView>
	);
}

function ToleranceSlider() {
	const [value, setValue] = React.useState(0);
	const gradient = new Gradient()
		.setColorGradient(Theme.color.red, Theme.color.green, Theme.color.black)
		.setMidpoint(21)
		.getColors();

	const thumbColor = gradient[value + 10];

	return (
		<View style={s.sliderView}>
			<View style={s.sliderValue}>
				<Text style={s.sliderValueText}>{10}</Text>
				<Text style={s.sliderValueText}>{0}</Text>
				<Text style={s.sliderValueText}>{-10}</Text>
			</View>
			<View style={s.sliderWrap}>
				<Slider
					minimumValue={-10}
					maximumValue={10}
					value={0}
					step={1}
					minimumTrackTintColor={'transparent'}
					maximumTrackTintColor={'transparent'}
					thumbTintColor={thumbColor}
					onValueChange={(val) => setValue(val)}
				/>
				<View style={s.sliderTrackWrap}>
					<LinearGradient
						colors={[Theme.color.red, Theme.color.green, Theme.color.black]}
						start={[0, 1]}
						end={[1, 0]}
						style={s.sliderTrack}
					/>
				</View>
			</View>
			<View style={s.sliderLabel}>
				{levels.map(({ header, text }) => (
					<View key={header} style={s.sliderStep}>
						<Text style={s.sliderHeader}>{header}</Text>
						<Text style={s.sliderText}>{text}</Text>
					</View>
				))}
			</View>
		</View>
	);
}

const s = StyleSheet.create({
	picker: {
		borderColor: Theme.color.grey,
		borderWidth: 2,
	},
	pickerItem: {
		fontSize: Theme.fontSize.small,
		fontWeight: '600',
	},
	sliderView: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
	},
	sliderValue: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		textAlign: 'center',
	},
	sliderValueText: {
		fontSize: Theme.fontSize.medium,
		fontWeight: 'bold',
	},
	sliderWrap: {
		width: '100%',
		marginBottom: Theme.padding,
		marginTop: Theme.padding,
	},
	sliderTrackWrap: {
		position: 'absolute',
		top: 0,
		left: 0,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
	},
	sliderTrack: {
		width: '100%',
		height: 5,
	},
	sliderLabel: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	sliderStep: {
		flex: 1,
		width: '33.3333%',
		flexDirection: 'column',
	},
	sliderHeader: {
		fontWeight: 'bold',
	},
	sliderText: {},
	tempSection: {
		flexBasis: '33.3333%',
	},
	level: {
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 1,
		height: sliderHeight,
		paddingLeft: Theme.margin,
	},
	step: {
		justifyContent: 'center',
		flex: 1,
	},
	selected: {
		fontWeight: 'bold',
	},
});
