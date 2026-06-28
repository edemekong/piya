import type { TimeAt } from "../model/availability";

function parseTimeAt(value: string): TimeAt {
  const [hour = "0", minute = "0"] = value.split(":");

  return {
    hour: Number(hour),
    minute: Number(minute),
  };
}

export { parseTimeAt };
