import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Theme from '@/styles/theme';
import { useSegments } from 'expo-router';
import useStore from '@/lib/store';

export type Props = {
	items: { id: string; title: string }[];
	id: string;
	label?: string | undefined | null;
	slug: string | undefined | null;
};

export default function SelectInput({ items, slug, id, label }: Props) {
	const [selected, setSelected] = useState<string | null>(null);
	const [section] = useSegments();
	const { updateData, data } = useStore();

	useEffect(() => {
		if (selected !== null) {
			const title = items.find((item) => item.id === selected)?.title;
			slug && updateData({ [slug]: title }, section);
		}
	}, [selected]);

	return (
		<Picker
			style={s.picker}
			itemStyle={s.pickerItem}
			numberOfLines={1}
			selectedValue={selected}
			onValueChange={(itemValue, itemIndex) => setSelected(itemValue)}
		>
			{items.map(({ id, title }) => (
				<Picker.Item label={title} value={id} key={id} color={Theme.color.green} />
			))}
		</Picker>
	);
}

const s = StyleSheet.create({
	picker: {
		borderColor: Theme.color.grey,
		borderWidth: 2,
		marginBottom: Theme.margin,
	},
	pickerItem: {
		fontSize: Theme.fontSize.small,
		fontWeight: "600",
	},
});
