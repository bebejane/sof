import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { Loader, TextInput, PageView, Spacer, Text, Button, List, Header } from '@/components/ui';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Gradient from 'javascript-color-gradient';
import { StyleSheet, View } from 'react-native';
import { useQuery } from '@/lib/client';
import { ToleranceWindowDocument } from '@/graphql';
import StructuredContent from '@/components/StructuredContent';
import React, { useEffect, useState } from 'react';
import Theme from '@/styles/theme';
import ReadMoreContent from '@/components/ReadMoreContent';
import useStore from '@/lib/store';
import { useRouter, useSegments } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import SelectInput from '@/components/ui/SelectInput';

const sliderHeight = Theme.screenHeight / 2;
const levels = [
	{ header: 'Under', text: 'Avsängd, bortdomnad, frånvarande, känns overkligt, anpassar mig' },
	{ header: 'Mitt i', text: 'I balans, kan hantera och vara fokuserad' },
	{ header: 'Över', text: 'Stark rädsla, raseri' },
];

export default function ToleranceWindows() {
	const [selectedTool, setSelectedTool] = useState<string | null>(null);
	const [selectedTolerance, setSelectedTolerance] = useState<number>(0);
	const [section] = useSegments();
	const navigation = useNavigation();
	const router = useRouter();
	const { updateData, data: storeData, resetKeys } = useStore();
	const [data, error, loading, retry] = useQuery<ToleranceWindowQuery>(ToleranceWindowDocument);
	const items = storeData.tolerance ?? [];

	useEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [data]);

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	const { sofToleranceWindow, allSofCalmingToolingTools: tools } = data;
	const labelKey = sofToleranceWindow?.inputs.find(
		(item) => item.__typename === 'SofInputTextRecord'
	)?.slug;

	const save = () => {
		const currentItem: { [key: string]: string | number } = {
			id: nanoid(),
			date: new Date().toString(),
			'tolerance-window-level': selectedTolerance,
			label: labelKey ? storeData[section]?.[labelKey] : undefined,
		};

		if (selectedTool) {
			currentItem['tolerance-window-tool'] = selectedTool;
		}

		sofToleranceWindow?.inputs.forEach((item) => {
			currentItem[item.slug] = storeData[section]?.[item.slug];
		});

		const tolerance = [...items, currentItem].sort((a, b) =>
			new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1
		);

		const resetFields = sofToleranceWindow?.inputs.map((item: any) => item.slug) as string[];
		updateData(tolerance, 'tolerance');
		resetKeys(resetFields, section);
	};

	return (
		<PageView>
			<ReadMoreContent>
				<StructuredContent content={sofToleranceWindow?.intro} />
			</ReadMoreContent>
			<Spacer size='small' />
			{sofToleranceWindow?.inputs.map((input, i) => (
				<TextInput key={i} slug={input.slug} label={input.label} />
			))}
			<Spacer />
			<ToleranceSlider onValueChange={(val) => setSelectedTolerance(val)} />
			<Spacer />
			<StructuredContent
				content={sofToleranceWindow?.introTools}
				styles={{
					p: {
						color: Theme.color.green,
						fontSize: Theme.fontSize.default,
					},
				}}
			/>
			<Spacer size='small' />
			<SelectInput
				id={'tolerance-window-tool'}
				label={'Välj ett verktyg'}
				slug={'tolerance-window-tool'}
				deselected={`Välj verktyg`}
				items={tools.map(({ id, title }) => ({ id, title }))}
				onValueChange={(val) => setSelectedTool(val)}
			/>
			<Spacer />
			<Button onPress={save}>Spara</Button>
			<Spacer />
			<List
				onPress={(id) => router.navigate(`/tolerance-window/${id}`)}
				title='Toleransfönster'
				emptyText='Det finns inga inlägg...'
				items={items?.map((item) => ({
					id: item.id,
					date: item.date,
					label: item.label,
				}))}
			/>
		</PageView>
	);
}

function ToleranceSlider({ onValueChange }: { onValueChange: (value: number) => void }) {
	const [value, setValue] = React.useState(0);
	const gradient = new Gradient()
		.setColorGradient(Theme.color.red, Theme.color.green, Theme.color.black)
		.setMidpoint(21)
		.getColors();

	const thumbColor = gradient[value + 10];

	useEffect(() => {
		onValueChange(value);
	}, [value]);

	return (
		<View style={s.sliderView}>
			<View style={s.sliderValue}>
				<Text style={s.sliderValueText}>{-10}</Text>
				<Text style={[s.sliderValueText, s.sliderValueTextCenter]}>{0}</Text>
				<Text style={s.sliderValueText}>{10}</Text>
			</View>
			<View style={s.sliderWrap}>
				<Slider
					minimumValue={-10}
					maximumValue={10}
					value={value}
					step={1}
					minimumTrackTintColor={'transparent'}
					maximumTrackTintColor={'transparent'}
					thumbTintColor={thumbColor}
					onSlidingComplete={(val) => setValue(val)}
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
			<View style={s.sliderLabels}>
				{levels.map(({ header, text }, i) => (
					<View
						key={header}
						style={[s.sliderStep, i === levels.length - 1 ? s.sliderStepLast : null]}
					>
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
	sliderValueTextCenter: {
		marginLeft: -8,
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
	sliderLabels: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	sliderStep: {
		flex: 1,
		width: '33.3333%',
		paddingRight: Theme.margin / 2,
		flexDirection: 'column',
	},
	sliderStepLast: {
		paddingRight: 0,
	},
	sliderHeader: {
		fontWeight: 'bold',
	},
	sliderText: {
		fontSize: Theme.fontSize.small,
	},
	tempSection: {
		flexBasis: '20.3333%',
	},
	header: {
		color: Theme.color.green,
		fontSize: Theme.fontSize.small,
		fontWeight: 500,
		marginBottom: Theme.margin / 2,
		lineHeight: Theme.lineHeight.default,
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
