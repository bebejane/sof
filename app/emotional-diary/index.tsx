import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { Button, TextInput, Loader, SliderInput, PageView, Spacer, List } from '@/components/ui';
import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useQuery } from '../../lib/client';
import { EmotionalDiaryDocument } from '../../graphql';
import useStore from '../../lib/store';
import { useNavigation, useRouter, useSegments } from 'expo-router';
import Theme from '@/styles/theme';
import SelectInput from '@/components/ui/SelectInput';

export default function EmotionalDiary() {
	const [section] = useSegments();
	const navigation = useNavigation();
	const router = useRouter();
	const [data, error, loading, retry] = useQuery<EmotionalDiaryQuery>(EmotionalDiaryDocument);
	const { updateData, data: storeData, resetKeys } = useStore();
	const items = storeData.diary ?? [];

	useEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [data]);

	const save = () => {
		const currentItem: { [key: string]: string | number } = {
			id: nanoid(),
			date: new Date().toString(),
		};

		sofEmotionalDiary?.inputs.forEach((item) => {
			currentItem[item.slug] = storeData[section]?.[item.slug];
		});

		const diary = [...items, currentItem].sort((a, b) =>
			new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1
		);

		const resetFields = sofEmotionalDiary?.inputs.map((item: any) => item.slug) as string[];
		updateData(diary, 'diary');
		resetKeys(resetFields, section);
	};

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;
	const { sofEmotionalDiary } = data;

	return (
		<PageView>
			{sofEmotionalDiary?.inputs.map((item) =>
				item.__typename === 'SofInputTextRecord' ? (
					<TextInput key={item.id} slug={item.slug} title={item.label} label={item.text} />
				) : item.__typename === 'SofInputSelectRecord' ? (
					<SelectInput
						key={item.id}
						id={item.id}
						label={item.label}
						slug={item.slug}
						deselected={`Välj ${item.label}`}
						items={item.options.map((o) => ({ id: o.id, title: o.label }))}
					/>
				) : (
					<SliderInput
						key={item.id}
						id={item.id}
						label={item.label}
						slug={item.slug}
						min={item.min}
						max={item.max}
					/>
				)
			)}
			<Button onPress={save}>Spara</Button>
			<Spacer />
			<List
				onPress={(id) => router.navigate(`/emotional-diary/${id}`)}
				title='Dagbokslogg'
				emptyText='Det finns inga dagboksinlägg...'
				items={items?.map(({ id, date, situation, label }) => ({ id, date, label: situation }))}
			/>
		</PageView>
	);
}

const s = StyleSheet.create({
	list: {
		display: 'flex',
		flexDirection: 'column',
		borderTopColor: Theme.color.green,
		borderTopWidth: 1,
	},
	item: {
		width: '100%',
		paddingTop: Theme.padding,
		paddingBottom: Theme.padding,
		borderBottomColor: Theme.color.green,
		borderBottomWidth: 1,
	},
	itemText: {
		fontSize: Theme.fontSize.large,
	},
});
