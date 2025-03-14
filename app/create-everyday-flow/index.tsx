import { Paragraph, PageView, Loader, TextInput } from '@/components/ui';
import ReadMoreContent from '@/components/ReadMoreContent';
import { useQuery } from '@/lib/client';
import { CreateEverydayFlowDocument } from '@/graphql';
import StructuredContent from '@/components/StructuredContent';

export default function CreateEverydayFlow() {
	const [data, error, loading, retry] = useQuery<CreateEverydayFlowQuery>(
		CreateEverydayFlowDocument
	);

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	const { sofCreateEverydayFlow } = data;

	return (
		<PageView onFocus={retry}>
			<StructuredContent content={sofCreateEverydayFlow?.intro} />
		</PageView>
	);
}
