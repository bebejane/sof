import { Paragraph, PageView, Loader, TextInput } from '@/components/ui';
import ReadMoreContent from '@/components/ReadMoreContent';
import { useQuery } from '@/lib/client';
import { MaintanencePlanDocument } from '@/graphql';

export default function MaintenancePlan() {
	const [data, error, loading, retry] = useQuery<MaintanencePlanQuery>(MaintanencePlanDocument);

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	const { sofMaintanencePlan } = data;

	return (
		<PageView>
			<ReadMoreContent>
				<Paragraph>{sofMaintanencePlan?.intro}</Paragraph>
			</ReadMoreContent>
			{sofMaintanencePlan?.inputs.map(({ id, label, slug }) => (
				<TextInput key={id} label={label} slug={slug} />
			))}
		</PageView>
	);
}
