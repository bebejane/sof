import { Loader, TextInput, PageView, Spacer, Text } from '@/components/ui';
import VerticalSlider from '@/components/VerticalSlider';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useQuery } from '@/lib/client';
import { ToleranceWindowDocument } from '@/graphql';
import StructuredContent from '@/components/StructuredContent';
import React, { useState } from 'react';
import Theme from '@/styles/theme';

const sliderWidth = 30;
const sliderHeight = Theme.screenHeight / 2;
const sliderThumbWidth = 30;
const levels = [
	'Över - stark rädsla, raseri',
	'Mitt i - i balans, kan hantera och vara fokuserad',
	'Under - avsängd, bortdomnad, frånvarande, känns ovärkligt, överanpassar mig',
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
				numberOfLines={1}
				selectedValue={selectedTool}
				onValueChange={(itemValue, itemIndex) => setSelectedTool(itemValue)}
			>
				{tools.map(({ id, title }) => (
					<Picker.Item label={title} value={id} key={id} style={s.pickerItem} />
				))}
			</Picker>
			<Spacer />
			<ToleranceVerticalSlider />
		</PageView>
	);
}

function ToleranceVerticalSlider() {
	const [value, setValue] = React.useState(1);

	return (
		<View style={s.sliderView}>
			<View style={s.slider}>
				<VerticalSlider
					value={value}
					onChange={(value: number) => setValue(value)}
					height={sliderHeight}
					width={sliderWidth}
					renderIndicatorHeight={sliderThumbWidth}
					step={1}
					min={0}
					max={levels.length - 1}
					borderRadius={0}
					minimumTrackTintColor='transparent'
					maximumTrackTintColor='transparent'
					showIndicator={true}
					animationConfig={{ damping: 30, stiffness: 500 }}
					renderIndicator={() => (
						<View
							style={{
								backgroundColor: Theme.color.black,
								width: sliderThumbWidth,
								height: sliderThumbWidth,
							}}
						></View>
					)}
					containerStyle={{
						borderRadius: 0,
						zIndex: 100,
						height: sliderHeight,
						width: sliderWidth,
					}}
					sliderStyle={{ borderRadius: 0 }}
				/>
				<View style={s.temp}>
					<View style={[s.tempSection, { backgroundColor: 'red' }]} />
					<View style={[s.tempSection, { backgroundColor: 'green' }]} />
					<View style={[s.tempSection, { backgroundColor: 'gray' }]} />
				</View>
			</View>

			<View style={s.level}>
				{levels.map((text, idx) => (
					<View key={idx} style={s.step}>
						<Text style={value === levels.length - 1 - idx && s.selected}>{text}</Text>
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
	pickerItem: {},
	sliderView: {
		flex: 1,
		flexDirection: 'row',
		width: Theme.screenWidth - Theme.margin * 2,
	},
	slider: {
		flex: 0,
		width: sliderWidth,
		height: sliderHeight,
		flexBasis: sliderWidth,
	},
	temp: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 0,
		width: sliderWidth,
		height: sliderHeight,
		flex: 1,
		flexDirection: 'column',
		backgroundColor: Theme.color.green,
	},
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
