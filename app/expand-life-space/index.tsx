import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import {
	PageView,
	Loader,
	TextInput,
	SliderInput,
	Button,
	Spacer,
	List,
	Text,
	DatePicker,
} from '@/components/ui';
import ReadMoreContent from '@/components/ReadMoreContent';
import { useQuery } from '@/lib/client';
import { ExpandLifeSpaceDocument } from '@/graphql';
import StructuredContent from '@/components/StructuredContent';
import React, { useEffect } from 'react';
import { useNavigation, useRouter, useSegments } from 'expo-router';
import useStore from '@/lib/store';
import SelectInput from '@/components/ui/SelectInput';

export default function ExpandLifeSpace() {
	const [data, error, loading, retry] = useQuery<ExpandLifeSpaceQuery>(ExpandLifeSpaceDocument);
	const [section] = useSegments();
	const router = useRouter();
	const navigation = useNavigation();
	const { updateData, data: storeData, resetKeys } = useStore();
	const items = storeData.expandLifeSpaces ?? [];

	useEffect(() => {
		navigation.setOptions({ headerShown: false });
	}, [data]);

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	const { sofExpandLifeSpace } = data;

	if (!sofExpandLifeSpace) return <Text>Det finns ingen data...</Text>;

	const save = () => {
		const currentItem: { [key: string]: string | number } = {
			id: nanoid(),
			date: new Date().toString(),
		};

		sofExpandLifeSpace?.inputs.forEach((item) => {
			currentItem[item.slug] = storeData[section]?.[item.slug];
		});

		const expandLifeSpaces = [...items, currentItem].sort((a, b) =>
			new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1
		);

		const resetFields = sofExpandLifeSpace?.inputs.map((item: any) => item.slug) as string[];
		updateData(expandLifeSpaces, 'expandLifeSpaces');
		resetKeys(resetFields, section);
	};

	const itemLabelSlug = sofExpandLifeSpace?.inputs.find(
		(item) => item.__typename === 'SofInputTextRecord'
	)?.slug;
	const itemValueSlug = sofExpandLifeSpace?.inputs.find(
		(item) => item.__typename === 'SofInputSliderRecord'
	)?.slug;

	return (
		<PageView>
			<ReadMoreContent key={Math.random()}>
				<StructuredContent content={sofExpandLifeSpace?.intro} />
			</ReadMoreContent>
			{sofExpandLifeSpace?.inputs.map((item) =>
				item.__typename === 'SofInputTextRecord' ? (
					<TextInput key={item.id} label={item.label} slug={item.slug} />
				) : item.__typename === 'SofInputSliderRecord' ? (
					<SliderInput
						key={item.id}
						id={item.id}
						label={item.label}
						slug={item.slug}
						min={item.min}
						max={item.max}
					/>
				) : item.__typename === 'SofInputSelectRecord' ? (
					<SelectInput
						key={item.id}
						id={item.id}
						label={item.label}
						slug={item.slug}
						items={item.options.map((o) => ({ id: o.id, title: o.label }))}
					/>
				) : item.__typename === 'SofInputDateRecord' ? (
					<DatePicker key={item.id} id={item.id} label={item.label} slug={item.slug} />
				) : null
			)}

			<Spacer size='small' />
			<Button onPress={save}>Spara</Button>
			<Spacer />
			<List
				onPress={(id) => router.navigate(`/expand-life-space/${id}`)}
				title='Vidga livsutrymmet'
				emptyText='Det finns inga sparade inlägg...'
				items={items?.map((item) => ({
					id: item.id,
					date: item.date,
					label:
						itemLabelSlug && item[itemLabelSlug] !== undefined ? item[itemLabelSlug] : undefined,
					value:
						itemValueSlug && item[itemValueSlug] !== undefined ? item[itemValueSlug] : undefined,
				}))}
			/>
		</PageView>
	);
}
