export async function notifyOwner(notification: {
  title: string;
  content: string;
}): Promise<void> {
  console.log(`[Notification] ${notification.title}:`, notification.content);
}
