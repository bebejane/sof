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
import { useQuery } from '@/lib/client';
import { ExpandLifeSpaceDocument } from '@/graphql';
import StructuredContent from '@/components/StructuredContent';
import React from 'react';
import { useNavigation, useRouter, useSegments } from 'expo-router';
import useStore from '@/lib/store';

export default function ExpandLifeSpace() {
	const [data, error, loading, retry] = useQuery<ExpandLifeSpaceQuery>(ExpandLifeSpaceDocument);
	const [section] = useSegments();
	const router = useRouter();
	const { updateData, data: storeData, resetKeys } = useStore();
	const items = storeData.expandLifeSpaces ?? [];
	const itemLabelSlug = 'vad-vill-jag-overvinna-exponera-mig-for';

	function save() {
		updateData({
			expandLifeSpaces:
				storeData.expandLifeSpaces?.filter((item: any) => item.id !== section) ?? [],
		});
	}

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	const { sofExpandLifeSpace } = data;

	if (!sofExpandLifeSpace) return <Text>Det finns ingen data...</Text>;

	return (
		<PageView>
			<StructuredContent content={sofExpandLifeSpace?.intro} />
			{sofExpandLifeSpace?.inputs.map((item) =>
				item.__typename === 'SofInputTextRecord' ? (
					<React.Fragment key={item.id}>
						<TextInput title={item.label} label={item.text} slug={item.slug} />
					</React.Fragment>
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
					<>hej select</>
				) : item.__typename === 'SofInputDateRecord' ? (
					<DatePicker key={item.id} id={item.id} label={item.label} slug={item.slug} />
				) : null
			)}
			<Button
				onPress={() =>
					resetKeys(
						sofExpandLifeSpace.inputs.map((item) => item.slug),
						section
					)
				}
			>
				Rensa
			</Button>
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
					label: itemLabelSlug && item[itemLabelSlug] ? item[itemLabelSlug] : undefined,
				}))}
			/>
		</PageView>
	);
}
