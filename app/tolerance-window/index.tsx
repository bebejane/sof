import { Loader, TextInput, PageView, Spacer, Text } from '@/components/ui';
import VerticalSlider from 'rn-vertical-slider';
import { StyleSheet, View } from 'react-native';
import { useQuery } from '@/lib/client';
import { ToleranceWindowDocument } from '@/graphql';
import StructuredContent from '@/components/StructuredContent';
import React from 'react';
import Theme from '@/styles/theme';

const sliderWidth = 30;
const sliderHeight = Theme.screenHeight / 2;
const sliderThumbWidth = 50;

export default function ToleranceWindows() {
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
			<Text>{tools.map(({ title }) => title).join(', ')}</Text>
			<Spacer />
			<ToleranceVerticalSlider />
		</PageView>
	);
}

function ToleranceVerticalSlider() {
	const [value, setValue] = React.useState(0);

	return (
		<View style={s.view}>
			<View style={s.slider}>
				<VerticalSlider
					value={value}
					onChange={(value) => setValue(value)}
					height={sliderHeight}
					width={sliderWidth}
					step={1}
					min={1}
					max={3}
					borderRadius={0}
					minimumTrackTintColor='transparent'
					maximumTrackTintColor='transparent'
					showIndicator={true}
					animationConfig={{}}
					renderIndicator={() => (
						<View
							style={{
								height: sliderWidth,
								width: sliderWidth,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<View
								style={{
									backgroundColor: Theme.color.black,
									width: sliderThumbWidth,
									height: sliderThumbWidth,
									borderRadius: sliderThumbWidth / 2,
								}}
							></View>
						</View>
					)}
					containerStyle={{ borderRadius: 0, zIndex: 100 }}
					sliderStyle={{ borderRadius: 5 }}
				/>
			</View>
			<View style={s.level}>
				<View style={s.step}>
					<Text>Över - stark rädsla, raseri</Text>
				</View>
				<View style={s.step}>
					<Text>Mitt i - i balans, kan hantera och vara fokuserad</Text>
				</View>
				<View style={s.step}>
					<Text>Under - avsängd, bortdomnad, frånvarande, känns ovärkligt, överanpassar mig</Text>
				</View>
			</View>
			<View style={s.temp}>
				<View style={[s.tempSection, { backgroundColor: 'red' }]} />
				<View style={[s.tempSection, { backgroundColor: 'green' }]} />
				<View style={[s.tempSection, { backgroundColor: 'gray' }]} />
			</View>
		</View>
	);
}

const s = StyleSheet.create({
	view: {
		flex: 1,
		flexDirection: 'row',
		height: sliderHeight,
		width: Theme.screenWidth - Theme.margin * 2,
		marginBottom: Theme.margin,
	},
	slider: {
		width: sliderWidth,
		height: sliderHeight,
		flexBasis: sliderWidth,
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
	temp: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 0,
		width: sliderWidth,
		height: sliderHeight,
		overflow: 'visible',
		flexDirection: 'column',
		backgroundColor: Theme.color.green,
	},
	tempSection: {
		flexBasis: '33.3333%',
	},
});
