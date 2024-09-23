import { Plus } from 'lucide-react'
import { OutlineButton } from './ui/outline-button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPendingGoals } from '../http/get-pending-goals'
import { createGoalCompletion } from '../http/create-goal-completion'

export function PendinGoals() {
  const client = useQueryClient()

  const { data } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPendingGoals,
  })

  const { mutate: handleCreateGoalCompletion } = useMutation({
    mutationFn: createGoalCompletion,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['summary'] })
      client.invalidateQueries({ queryKey: ['pending-goals'] })
    },
  })

  if (!data) {
    return null
  }

  function handleCompletionGoal(goalId: string) {
    handleCreateGoalCompletion(goalId)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {data.map(pendingGoal => {
        const isCompleted =
          pendingGoal.completionCount >= pendingGoal.desiredWeeklyFrequency

        return (
          <OutlineButton
            key={pendingGoal.id}
            disabled={isCompleted}
            onClick={() => handleCompletionGoal(pendingGoal.id)}
          >
            <Plus className="size-4 text-zinc-600" />
            {pendingGoal.title}
          </OutlineButton>
        )
      })}
    </div>
  )
}
