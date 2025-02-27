import { PageView, Loader, Header, SliderInput, Spacer } from '@/components/ui';
import { useQuery } from '@/lib/client';
import { AssessProgressDocument } from '@/graphql';

export default function AssessProgress() {
	const [data, error, loading, retry] = useQuery<AssessProgressQuery>(AssessProgressDocument);

	if (loading || error) return <Loader loading={loading} error={'sad'} onRetry={retry} />;

	const { sofAssessProgress } = data;

	return (
		<PageView>
			<Spacer size='small' />
			<Header size='medium'>Skatta framsteg sedan senaste samtalet</Header>
			{sofAssessProgress?.inputs.map(({ id, label, slug, min, max }) => (
				<SliderInput key={id} id={id} label={label} slug={slug} min={min} max={max} />
			))}
		</PageView>
	);
}
