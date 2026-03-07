export function getFieldErrorMessage(errors: unknown[]): string | null {
  const firstError = errors[0];

  if (!firstError) {
    return null;
  }

  if (typeof firstError === "string") {
    return firstError;
  }

  if (typeof firstError === "object" && "message" in firstError) {
    const message = (firstError as { message?: unknown }).message;

    return typeof message === "string" ? message : null;
  }

  return null;
}
