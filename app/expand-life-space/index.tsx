import { PageView, Loader } from '@/components/ui';
import { useQuery } from '@/lib/client';
import { ExpandLifeSpaceDocument } from '@/graphql';
import StructuredContent from '@/components/StructuredContent';

export default function ExpandLifeSpace() {
	const [data, error, loading, retry] = useQuery<ExpandLifeSpaceQuery>(ExpandLifeSpaceDocument);

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	const { sofExpandLifeSpace } = data;

	return (
		<PageView>
			<StructuredContent content={sofExpandLifeSpace?.intro} />
		</PageView>
	);
}
