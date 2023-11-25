export function delay(seconds: number): Promise<void> {
  return new Promise((resolve, _) => {
    setTimeout(resolve, seconds * 1000);
  });
}
