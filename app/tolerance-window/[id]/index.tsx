import { useNavigation } from 'expo-router';
import { Header, Loader, PageView, Spacer, Button, Text } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';
import useStore from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { useQuery } from '../../../lib/client';
import { ToleranceWindowDocument } from '@/graphql';
import React from 'react';
import { useFocusEffect } from 'expo-router';

export type Props = {
	params: {
		id: string;
	};
};

export default function ToleranceWindowItem() {
	const [data, error, loading, retry] = useQuery<ToleranceWindowQuery>(ToleranceWindowDocument);
	const navigation = useNavigation();
	const id = useLocalSearchParams().id as string;
	const { data: storeData, updateData } = useStore();
	const tolerance = storeData.tolerance?.find((item: any) => id === item.id);

	useFocusEffect(() => {
		if (!tolerance) return;
		navigation.setOptions({ title: formatDate(tolerance.date) });
	});

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	if (!tolerance) return <Text>Hittade ej med id: {id}</Text>;

	const { sofToleranceWindow } = data;
	const extraInputs = [
		{ id: 'tolerance-window-level', label: 'Toleransnivå', slug: 'tolerance-window-level' },
		{ id: 'tolerance-window-tool', label: 'Verktyg', slug: 'tolerance-window-tool' },
	];
	return (
		<PageView>
			{extraInputs.concat(sofToleranceWindow?.inputs ?? []).map(({ label, slug }, i) => (
				<React.Fragment key={i}>
					<Header size='small' margin='small'>
						{label}
					</Header>
					<Text>{tolerance[slug]}</Text>
					<Spacer />
				</React.Fragment>
			))}
			<Button
				onPress={() => {
					updateData({ tolerance: storeData.tolerance?.filter((item: any) => item.id !== id) });
					navigation.goBack();
				}}
			>
				Ta bort
			</Button>
		</PageView>
	);
}
