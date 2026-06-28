import * as React from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import {
  addAvailabilitySlotMinutes,
  availabilityDayLabels,
  createAvailabilityTimeSlot,
  createDefaultAvailabilitySchedule,
  createEmptyAvailabilityDays,
  getAvailabilityTimezoneOptions,
  type AvailabilityDay,
  type AvailabilityScheduleDraft,
  type AvailabilityTimeSlot,
} from "@piya/shared";
import {
  AppCheckbox,
  AppIconButton,
  AppSelectField,
  AppSheet,
  AppTimePicker,
  Button,
  cn,
} from "@piya/ui";

type ConnectAvailabilitySheetProps = {
  initialSchedule?: AvailabilityScheduleDraft;
  isSaving?: boolean;
  onClose: () => void;
  onSave?: (schedule: AvailabilityScheduleDraft) => Promise<unknown> | unknown;
  open: boolean;
};

function ConnectAvailabilitySheet({
  initialSchedule,
  isSaving = false,
  onClose,
  onSave,
  open,
}: ConnectAvailabilitySheetProps) {
  const [schedule, setSchedule] = React.useState<AvailabilityScheduleDraft>(
    () => initialSchedule ?? createDefaultAvailabilitySchedule()
  );

  React.useEffect(() => {
    if (open) {
      setSchedule(initialSchedule ?? createDefaultAvailabilitySchedule());
    }
  }, [initialSchedule, open]);

  async function saveSchedule() {
    await onSave?.(schedule);
    onClose();
  }

  function updateTimezone(timezone: string) {
    setSchedule((current) => ({
      ...current,
      timezone,
      days:
        current.timezone === timezone
          ? current.days
          : createEmptyAvailabilityDays(),
    }));
  }

  function updateDay(day: number, updates: Partial<AvailabilityDay>) {
    setSchedule((current) => ({
      ...current,
      days: current.days.map((item) =>
        item.day === day ? { ...item, ...updates } : item
      ),
    }));
  }

  function addSlot(day: AvailabilityDay) {
    const lastSlot = day.slots[day.slots.length - 1];
    const startTime = lastSlot?.endTime ?? "09:00";
    const endTime = addAvailabilitySlotMinutes(startTime, 60);

    updateDay(day.day, {
      enabled: true,
      slots: [
        ...day.slots,
        {
          endTime,
          id: `slot_${day.day}_${Date.now()}`,
          startTime,
        },
      ],
    });
  }

  function updateSlot(
    day: AvailabilityDay,
    slotId: string,
    updates: Partial<AvailabilityTimeSlot>
  ) {
    updateDay(day.day, {
      slots: day.slots.map((slot) =>
        slot.id === slotId ? { ...slot, ...updates } : slot
      ),
    });
  }

  function removeSlot(day: AvailabilityDay, slotId: string) {
    const slots = day.slots.filter((slot) => slot.id !== slotId);
    updateDay(day.day, {
      enabled: slots.length > 0,
      slots,
    });
  }

  return (
    <AppSheet
      ariaLabel="set available hours"
      description="Choose the timezone, days, and times clients can book with you."
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            buttonState={isSaving ? "loading" : "enabled"}
            icon={<CheckCircle2 />}
            onClick={() => void saveSchedule()}
            type="button"
          >
            Save hours
          </Button>
        </>
      }
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      open={open}
      title="Set up available hours"
    >
      <div className="grid gap-5">
        <AppSelectField
          label="Timezone"
          onChange={(event) => updateTimezone(event.target.value)}
          options={getAvailabilityTimezoneOptions(schedule.timezone)}
          value={schedule.timezone}
        />

        <section className="grid gap-3">
          <h3 className="text-body font-normal text-[#2F4B4F]">Weekly hours</h3>

          <div className="grid">
            {schedule.days.map((day) => (
              <AvailabilityDayRow
                day={day}
                key={day.day}
                onAddSlot={() => addSlot(day)}
                onRemoveSlot={(slotId) => removeSlot(day, slotId)}
                onToggle={(enabled) =>
                  updateDay(day.day, {
                    enabled,
                    slots:
                      enabled && day.slots.length === 0
                        ? [createAvailabilityTimeSlot(day.day)]
                        : day.slots,
                  })
                }
                onUpdateSlot={(slotId, updates) =>
                  updateSlot(day, slotId, updates)
                }
              />
            ))}
          </div>
        </section>
      </div>
    </AppSheet>
  );
}

function AvailabilityDayRow({
  day,
  onAddSlot,
  onRemoveSlot,
  onToggle,
  onUpdateSlot,
}: {
  day: AvailabilityDay;
  onAddSlot: () => void;
  onRemoveSlot: (slotId: string) => void;
  onToggle: (enabled: boolean) => void;
  onUpdateSlot: (
    slotId: string,
    updates: Partial<AvailabilityTimeSlot>
  ) => void;
}) {
  const label = availabilityDayLabels[day.day - 1];
  const visibleSlots =
    day.enabled && day.slots.length > 0
      ? day.slots
      : [createAvailabilityTimeSlot(day.day)];

  return (
    <div className="mb-3 grid gap-3 py-2 last:mb-0 sm:grid-cols-[9rem_1fr]">
      <div className="flex items-center gap-3">
        <AppCheckbox
          checked={day.enabled}
          label={`${day.enabled ? "Disable" : "Enable"} ${label}`}
          onCheckedChange={onToggle}
        />
        <span className="font-semibold text-[#2F4B4F]">{label}</span>
      </div>

      <div className={cn("grid gap-2", !day.enabled && "opacity-50")}>
        {visibleSlots.map((slot, index) => {
          const isLastSlot = index === visibleSlots.length - 1;

          return (
            <div
              className="grid gap-2 sm:grid-cols-[150px_max-content_150px_88px] sm:justify-start"
              key={slot.id}
            >
              <AppTimePicker
                ariaLabel={`${label} start time`}
                className="w-[150px]"
                disabled={!day.enabled}
                onChange={(startTime) => onUpdateSlot(slot.id, { startTime })}
                popoverAlign="left"
                value={slot.startTime}
              />
              <span className="hidden self-center text-callout text-[#2F4B4F]/45 sm:block">
                -
              </span>
              <AppTimePicker
                ariaLabel={`${label} end time`}
                className="w-[150px]"
                disabled={!day.enabled}
                onChange={(endTime) => onUpdateSlot(slot.id, { endTime })}
                popoverAlign="right"
                value={slot.endTime}
              />
              <div className="flex items-center gap-1">
                <AppIconButton
                  disabled={!day.enabled}
                  icon={<Trash2 className="size-4" />}
                  label={`Remove ${label} time slot`}
                  onClick={() => onRemoveSlot(slot.id)}
                  type="button"
                  variant="ghost"
                />
                {isLastSlot ? (
                  <AppIconButton
                    disabled={!day.enabled}
                    icon={<Plus className="size-4" />}
                    label={`Add ${label} time slot`}
                    onClick={onAddSlot}
                    type="button"
                    variant="ghost"
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ConnectAvailabilitySheet };
export type { ConnectAvailabilitySheetProps };
