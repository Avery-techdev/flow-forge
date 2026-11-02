import { useExecutions } from '@/shared/hooks';
import { Screen, ScreenHeader } from '@/shared/components';
import { ExecutionList } from './ExecutionList';

export function ExecutionsScreen(): React.JSX.Element {
  const executions = useExecutions();

  return (
    <>
      <ScreenHeader
        title="Executions"
        description="History of your most recent workflow runs."
      />
      <Screen>
        <ExecutionList executions={executions} />
      </Screen>
    </>
  );
}
