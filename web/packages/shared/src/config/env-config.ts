import type { ImportMetaWithEnv } from "../types";

export function getEnvString(name: string, fallback = "") {
  return ((import.meta as ImportMetaWithEnv).env?.[name] ?? fallback).trim();
}

export function getEnvBoolean(name: string, fallback = false) {
  const value = getEnvString(name);

  if (!value) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function requireConfigValue(value: string, name: string) {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}
