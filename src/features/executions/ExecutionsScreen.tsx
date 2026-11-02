import { useState } from 'react';
import { loadExecutions } from '@/shared/services';
import { Screen, ScreenHeader } from '@/shared/components';
import { ExecutionList } from './ExecutionList';

export function ExecutionsScreen(): React.JSX.Element {
  const [executions] = useState(loadExecutions);

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
