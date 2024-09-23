import { X } from 'lucide-react'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './ui/radio-group'
import { Button } from './ui/button'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createGoal } from '../http/create-goal'

const createGoalSchema = zod.object({
  title: zod.string().min(1, 'Digite o nome da atividade'),
  desiredWeeklyFrequency: zod.coerce.number().min(1).max(7),
})

export type CreateGoalFormData = zod.infer<typeof createGoalSchema>

export function CreateGoal() {
  const client = useQueryClient()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalSchema),
  })

  const { mutate: createNewGoal } = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['pending-goals'] })
      client.invalidateQueries({ queryKey: ['summary'] })

      reset()
    },
  })

  function handleCreateGoal(data: CreateGoalFormData) {
    createNewGoal(data)
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose>
              <X className="size-4" />
            </DialogClose>
          </div>
          <DialogDescription>
            Adicione atividades que te fazem bem e que você dquer continuar
            praticando toda semana.
          </DialogDescription>
        </div>

        <form
          className="flex flex-col justify-between flex-1"
          onSubmit={handleSubmit(handleCreateGoal)}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>
              <Input
                id="title"
                placeholder="Praticar exercícios, meditar, etc..."
                autoFocus
                {...register('title')}
              />
              {errors.title && (
                <span className="italic text-red-500 text-sm mx-auto">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Quantas vezes na semana ?</Label>
              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={1}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup onValueChange={onChange} value={String(value)}>
                    <RadioGroupItem value="1">
                      <RadioGroupIndicator />{' '}
                      <span className="text-zinc-300 text-sm font-medium leading-none">
                        1x na semana
                      </span>
                      <span className="text-lg leading-none">🥱</span>
                    </RadioGroupItem>
                    <RadioGroupItem value="2">
                      <RadioGroupIndicator />{' '}
                      <span className="text-zinc-300 text-sm font-medium leading-none">
                        2x na semana
                      </span>
                      <span className="text-lg leading-none">🙂</span>
                    </RadioGroupItem>
                    <RadioGroupItem value="3">
                      <RadioGroupIndicator />{' '}
                      <span className="text-zinc-300 text-sm font-medium leading-none">
                        3x na semana
                      </span>
                      <span className="text-lg leading-none">😎</span>
                    </RadioGroupItem>
                    <RadioGroupItem value="4">
                      <RadioGroupIndicator />{' '}
                      <span className="text-zinc-300 text-sm font-medium leading-none">
                        4x na semana
                      </span>
                      <span className="text-lg leading-none">😍</span>
                    </RadioGroupItem>
                    <RadioGroupItem value="5">
                      <RadioGroupIndicator />{' '}
                      <span className="text-zinc-300 text-sm font-medium leading-none">
                        5x na semana
                      </span>
                      <span className="text-lg leading-none">🤩</span>
                    </RadioGroupItem>
                    <RadioGroupItem value="6">
                      <RadioGroupIndicator />{' '}
                      <span className="text-zinc-300 text-sm font-medium leading-none">
                        6x na semana
                      </span>
                      <span className="text-lg leading-none">🤪</span>
                    </RadioGroupItem>
                    <RadioGroupItem value="7">
                      <RadioGroupIndicator />{' '}
                      <span className="text-zinc-300 text-sm font-medium leading-none">
                        7x na semana
                      </span>
                      <span className="text-lg leading-none">🤯</span>
                    </RadioGroupItem>
                  </RadioGroup>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="flex-1">
                Fechar
              </Button>
            </DialogClose>
            <Button className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
