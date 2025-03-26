import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import React from 'react';
import Theme from '@/styles/theme';
import { useSegments } from 'expo-router';
import useStore from '@/lib/store';

export type Props = {
	items: { id: string; title: string }[];
	id: string;
	label?: string | undefined | null;
	slug: string | undefined | null;
	onValueChange?: (value: string | null) => void;
};

const deselected = { id: 'null', title: '' };

export default function SelectInput({ items, slug, onValueChange }: Props) {
	const [section] = useSegments();
	const { updateData, data } = useStore();
	const selected = slug
		? items.find(({ title }) => title === data[section]?.[slug])?.id ?? null
		: null;

	return (
		<Picker
			style={s.picker}
			itemStyle={s.pickerItem}
			numberOfLines={1}
			mode='dropdown'
			tvParallaxMagnification={1}
			selectedValue={selected}
			onValueChange={(itemValue, itemIndex) => {
				if (slug) {
					const val = items[itemIndex - 1]?.title;
					updateData({ [slug]: val }, section);
					onValueChange && onValueChange(val ?? null);
				}
			}}
		>
			{[deselected].concat(items).map(({ id, title }) => (
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
		fontWeight: '600',
	},
});
