export async function createGoalCompletion(
  goalId: string
) {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  await fetch(`${apiUrl}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      goalId,
    }),
  })
}
