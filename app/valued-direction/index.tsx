import { Paragraph, Loader, TextInput, PageView, Image } from '@/components/ui';
import { useQuery } from '@/lib/client';
import { ValuedDirectionDocument } from '@/graphql';

export default function ValuedDirectionWithGoal() {
	const [data, error, loading, retry] = useQuery<ValuedDirectionQuery>(ValuedDirectionDocument);

	if (loading || error) return <Loader loading={loading} error={error} onRetry={retry} />;

	const { sofValuedDirection } = data;

	return (
		<PageView>
			<Paragraph>{sofValuedDirection?.intro}</Paragraph>
			<TextInput slug={sofValuedDirection?.input.slug} label={sofValuedDirection?.input.label} />
			<Paragraph>{sofValuedDirection?.text}</Paragraph>
			<Image data={sofValuedDirection?.image as FileField} />
		</PageView>
	);
}
