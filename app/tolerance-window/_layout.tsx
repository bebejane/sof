import useStore from '@/lib/store';
import { Stack } from 'expo-router';
import { formatDate } from '@/lib/utils';
import StackHeader from '@/components/StackHeader';

export default function Layout() {
	const { data } = useStore();
	const tolerance = data.tolerance ?? [];

	return (
		<StackHeader>
			{tolerance?.map(({ id, date }, i) => (
				<Stack.Screen
					key={id}
					name={`tolerance-window/${id}`}
					initialParams={{ id, date }}
					options={{
						title: formatDate(date),
						headerTitle: formatDate(date),
					}}
				/>
			))}
		</StackHeader>
	);
}
