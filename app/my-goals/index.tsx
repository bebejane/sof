import { Paragraph, Loader, TextInput, PageView, Header, Spacer } from '@/components/ui';
import { useQuery } from '@/lib/client';
import { MyGoalDocument } from '@/graphql';

export default function MyGoals() {
	const [data, error, loading, retry] = useQuery<MyGoalQuery>(MyGoalDocument);
	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	const { sofMyGoal } = data;

	return (
		<PageView>
			<Header>Effektmål</Header>
			{sofMyGoal?.performanceGoals.map((input, i) => (
				<TextInput key={i} slug={input.slug} label={input.label} />
			))}
			<Spacer />
			<Header>Beteendemål</Header>
			{sofMyGoal?.behavioralGoals.map((input, i) => (
				<TextInput key={i} slug={input.slug} label={input.label} />
			))}
		</PageView>
	);
}
