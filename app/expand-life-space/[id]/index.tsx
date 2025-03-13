import { useNavigation } from 'expo-router';
import { Header, Loader, PageView, Spacer, Button, Text } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';
import useStore from '@/lib/store';
import { useQuery } from '@/lib/client';
import { ExpandLifeSpaceDocument } from '@/graphql';
import React from 'react';
import { useFocusEffect } from 'expo-router';

export type Props = {
	params: {
		id: string;
	};
};

export default function SorkItem() {
	const [data, error, loading, retry] = useQuery<ExpandLifeSpaceQuery>(ExpandLifeSpaceDocument);
	const navigation = useNavigation();
	const id = useLocalSearchParams().id as string;
	const { data: storeData, updateData } = useStore();
	const expandLifeSpace = storeData.expandLifeSpaces?.find((item: any) => id === item.id);
	const titleKey = Object.keys(expandLifeSpace ?? {}).find(
		(key: string) => key.toLowerCase() === 'vad-vill-jag-overvinna-exponera-mig-for'
	);
	const title = titleKey ? expandLifeSpace?.[titleKey] : 'Ingen titel...';

	useFocusEffect(() => {
		if (!expandLifeSpace) return;
		navigation.setOptions({ title });
	});

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	if (!expandLifeSpace) return <Text>Hittade ej inlägg med id: {id}</Text>;

	const { sofExpandLifeSpace } = data;

	return (
		<PageView>
			{sofExpandLifeSpace?.inputs.map(({ id, label, text, slug }, i) => (
				<React.Fragment key={i}>
					<Header size='small' margin='small'>
						{label}
					</Header>
					<Text>{expandLifeSpace[slug]}</Text>
					<Spacer />
				</React.Fragment>
			))}
			<Button
				onPress={() => {
					updateData({
						expandLifeSpaces: storeData.expandLifeSpaces?.filter((item: any) => item.id !== id),
					});
					navigation.goBack();
				}}
			>
				Ta bort
			</Button>
		</PageView>
	);
}
