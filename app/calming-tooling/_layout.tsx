import { useQuery } from '@/lib/client';
import { CalmingToolStepsDocument } from '@/graphql';
import { Stack } from 'expo-router';
import StackHeader from '@/components/StackHeader';

export default function Layout() {
	const [data, error, loading, retry] = useQuery<CalmingToolStepsQuery>(CalmingToolStepsDocument);
	const { allSofCalmingToolTools: tools } = data;

	return (
		<StackHeader>
			{tools?.map(({ id, title, description }, i) => (
				<Stack.Screen
					key={id}
					name={`calming-tools/tool/${id}`}
					initialParams={{ id, title }}
					options={{
						title,
						headerTitle: title,
					}}
				/>
			))}
		</StackHeader>
	);
}
