import {
  MAX_APPEAL,
  MAX_CONSERVATION_POINTS,
  MIN_APPEAL,
  MIN_CONSERVATION_POINTS,
} from "@/games/ark-nova/domain/constants";

function validateIntegerField(
  value: string,
  min: number,
  max: number,
  label: string,
): string | undefined {
  const trimmed = value.trim();

  if (trimmed === "") {
    return "Required";
  }

  if (!/^\d+$/.test(trimmed)) {
    return `${label} must be a whole number`;
  }

  const parsed = Number(trimmed);

  if (parsed < min || parsed > max) {
    return `${label} must be between ${min} and ${max}`;
  }

  return undefined;
}

export function validateAppealField(value: string): string | undefined {
  return validateIntegerField(value, MIN_APPEAL, MAX_APPEAL, "Appeal");
}

export function validateConservationPointsField(
  value: string,
): string | undefined {
  return validateIntegerField(
    value,
    MIN_CONSERVATION_POINTS,
    MAX_CONSERVATION_POINTS,
    "Conservation points",
  );
}
