import { useQuery } from '@/lib/client';
import { CalmingToolingDocument } from '@/graphql';
import { Stack } from 'expo-router';
import StackHeader from '@/components/StackHeader';

export default function Layout() {
	const [data, error, loading, retry] = useQuery<CalmingToolingQuery>(CalmingToolingDocument);
	const { allSofCalmingToolingTools: tools } = data;

	return (
		<StackHeader>
			{tools?.map(({ id, title }, i) => (
				<Stack.Screen
					key={id}
					name={`calming-tooling/tool/${id}`}
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
