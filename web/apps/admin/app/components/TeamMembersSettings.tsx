import * as React from "react";
import { MoreVertical, Pencil, Send, Trash2 } from "lucide-react";
import {
  showToast,
  type AppDispatch,
  type InvitableMemberRoleType,
  type MemberData,
  type MemberInvitationData,
  useDeleteMemberInvitationMutation,
  useDeleteMemberMutation,
  useGetTeamQuery,
  useInviteMemberMutation,
  useUpdateMemberInvitationRoleMutation,
  useUpdateMemberRoleMutation,
} from "@piya/shared";
import {
  AppAvatar,
  AppFieldGrid,
  AppSelectField,
  AppSheet,
  AppTextField,
  Badge,
  Button,
  cn,
  SettingsCard,
} from "@piya/ui";
import { useDispatch } from "react-redux";

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
] as const;

type EditableTeamEntry =
  | { kind: "member"; value: MemberData }
  | { kind: "invitation"; value: MemberInvitationData };

type TeamMembersSettingsProps = {
  className?: string;
};

export function TeamMembersSettings({
  className,
}: TeamMembersSettingsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: team, error, isLoading } = useGetTeamQuery();
  const [inviteMember, inviteState] = useInviteMemberMutation();
  const [updateMemberRole, updateMemberState] =
    useUpdateMemberRoleMutation();
  const [updateInvitationRole, updateInvitationState] =
    useUpdateMemberInvitationRoleMutation();
  const [deleteMember, deleteMemberState] = useDeleteMemberMutation();
  const [deleteInvitation, deleteInvitationState] =
    useDeleteMemberInvitationMutation();
  const [email, setEmail] = React.useState("");
  const [inviteRole, setInviteRole] =
    React.useState<InvitableMemberRoleType>("admin");
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [editingEntry, setEditingEntry] =
    React.useState<EditableTeamEntry | null>(null);
  const [editingRole, setEditingRole] =
    React.useState<InvitableMemberRoleType>("admin");
  const currentUserRole = team?.currentUserRole;
  const canInvite =
    currentUserRole === "owner" || currentUserRole === "admin";
  const canManage = currentUserRole === "owner";
  const isDeleting =
    deleteMemberState.isLoading || deleteInvitationState.isLoading;
  const isUpdatingRole =
    updateMemberState.isLoading || updateInvitationState.isLoading;

  async function sendInvitation() {
    const invitationEmail = email.trim().toLowerCase();
    if (!invitationEmail) {
      showError("Enter the team member's email address.");
      return;
    }

    try {
      await inviteMember({
        email: invitationEmail,
        role: inviteRole,
      }).unwrap();
      setEmail("");
      showSuccess("Invitation sent.");
    } catch (mutationError) {
      showError(getTeamErrorMessage(mutationError, "Unable to send invitation."));
    }
  }

  function showRoleEditor(entry: EditableTeamEntry) {
    setOpenMenuId(null);
    setEditingEntry(entry);
    setEditingRole(
      entry.value.role === "owner" ? "admin" : entry.value.role,
    );
  }

  async function saveRole() {
    if (!editingEntry) return;

    try {
      if (editingEntry.kind === "member") {
        await updateMemberRole({
          memberId: editingEntry.value.id,
          role: editingRole,
        }).unwrap();
      } else {
        await updateInvitationRole({
          invitationId: editingEntry.value.id,
          role: editingRole,
        }).unwrap();
      }
      setEditingEntry(null);
      showSuccess("Role updated.");
    } catch (mutationError) {
      showError(getTeamErrorMessage(mutationError, "Unable to update role."));
    }
  }

  async function deleteEntry(entry: EditableTeamEntry) {
    setOpenMenuId(null);
    const label =
      entry.kind === "member" ? entry.value.name : entry.value.email;
    const confirmed = window.confirm(
      entry.kind === "member"
        ? `Delete ${label} from this team?`
        : `Delete the invitation for ${label}?`,
    );
    if (!confirmed) return;

    try {
      if (entry.kind === "member") {
        await deleteMember(entry.value.id).unwrap();
      } else {
        await deleteInvitation(entry.value.id).unwrap();
      }
      showSuccess(
        entry.kind === "member" ? "Team member deleted." : "Invitation deleted.",
      );
    } catch (mutationError) {
      showError(getTeamErrorMessage(mutationError, "Unable to delete this entry."));
    }
  }

  function showSuccess(message: string) {
    showToast(dispatch, { message, variant: "success" });
  }

  function showError(message: string) {
    showToast(dispatch, { message, variant: "error" });
  }

  const entries: EditableTeamEntry[] = [
    ...(team?.members.map(
      (member): EditableTeamEntry => ({ kind: "member", value: member }),
    ) ?? []),
    ...(team?.invitations.map(
      (invitation): EditableTeamEntry => ({
        kind: "invitation",
        value: invitation,
      }),
    ) ?? []),
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {canInvite ? (
        <SettingsCard
          actions={
            <Button
              buttonState={inviteState.isLoading ? "loading" : "enabled"}
              icon={<Send />}
              loadingLabel="Sending invitation"
              onClick={sendInvitation}
              size="sm"
              type="button"
            >
              Send invite
            </Button>
          }
          title="Invite teammate"
        >
          <AppFieldGrid className="md:grid-cols-[minmax(0,1fr)_220px]">
            <AppTextField
              label="Email address"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter teammate email"
              type="email"
              value={email}
            />
            <AppSelectField
              label="Role"
              onChange={(event) =>
                setInviteRole(event.target.value as InvitableMemberRoleType)
              }
              options={roleOptions}
              value={inviteRole}
            />
          </AppFieldGrid>
        </SettingsCard>
      ) : null}

      <SettingsCard title="Team members">
        {isLoading ? (
          <div className="flex min-h-28 items-center justify-center" role="status">
            <span
              aria-hidden="true"
              className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
            />
            <span className="sr-only">Loading team members</span>
          </div>
        ) : error ? (
          <p className="text-callout text-error">
            {getTeamErrorMessage(error, "Unable to load team members.")}
          </p>
        ) : entries.length === 0 ? (
          <p className="text-callout text-text-secondary">
            No team members yet.
          </p>
        ) : (
          <div className="grid gap-2">
            {entries.map((entry) => {
              const isInvitation = entry.kind === "invitation";
              const name = isInvitation ? entry.value.email : entry.value.name;
              const menuId = `${entry.kind}:${entry.value.id}`;
              const showActions =
                canManage &&
                (isInvitation || entry.value.role !== "owner");

              return (
                <div
                  className="flex items-center gap-3 rounded-md bg-fill px-3 py-3"
                  key={menuId}
                >
                  <AppAvatar className="size-10" name={name} />
                  <div className="min-w-0 flex-1">
                    {isInvitation ? (
                      <>
                        <p className="truncate italic text-[#2F4B4F]">
                          {entry.value.email}
                        </p>
                        <p className="text-footnote text-text-secondary">
                          Invitation pending
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-[#2F4B4F]">
                          {entry.value.name}
                        </p>
                        <p className="truncate text-footnote text-text-secondary">
                          {entry.value.email}
                        </p>
                      </>
                    )}
                  </div>
                  <Badge
                    className={cn(
                      "capitalize",
                      isInvitation &&
                        "border-transparent bg-surface-tertiary text-text-tertiary",
                    )}
                  >
                    {entry.value.role}
                  </Badge>

                  {showActions ? (
                    <div className="relative">
                      <button
                        aria-expanded={openMenuId === menuId}
                        aria-label={`Open actions for ${name}`}
                        className="flex size-8 items-center justify-center rounded-full text-text-secondary transition hover:bg-white"
                        disabled={isDeleting}
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === menuId ? null : menuId,
                          )
                        }
                        type="button"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {openMenuId === menuId ? (
                        <div className="absolute right-0 top-9 z-20 w-44 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
                          <button
                            className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition hover:bg-fill"
                            onClick={() => showRoleEditor(entry)}
                            type="button"
                          >
                            <Pencil className="size-4" />
                            Change role
                          </button>
                          <button
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-error transition hover:bg-fill"
                            onClick={() => deleteEntry(entry)}
                            type="button"
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </SettingsCard>

      <AppSheet
        ariaLabel="change team role"
        footer={
          <>
            <Button
              onClick={() => setEditingEntry(null)}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              buttonState={isUpdatingRole ? "loading" : "enabled"}
              loadingLabel="Updating role"
              onClick={saveRole}
              type="button"
            >
              Save role
            </Button>
          </>
        }
        onClose={() => setEditingEntry(null)}
        open={editingEntry !== null}
        title="Change role"
      >
        <AppSelectField
          label="Role"
          onChange={(event) =>
            setEditingRole(event.target.value as InvitableMemberRoleType)
          }
          options={roleOptions}
          value={editingRole}
        />
      </AppSheet>
    </div>
  );
}

function getTeamErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return error instanceof Error ? error.message : fallback;
}
