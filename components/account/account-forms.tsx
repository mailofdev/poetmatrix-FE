"use client";

import { useActionState } from "react";
import {
  becomeWriterAction,
  modeAction,
  passwordAction,
  profileAction,
} from "@/lib/product/actions";
import type { SessionUser } from "@/lib/api/types";
import type { ActionState } from "@/lib/validation/auth";
import { FormError, FormNote, SelectField, SubmitButton, TextField } from "../ui/form";

const initial: ActionState = {};

export function AccountForms({ user, actor }: { user: SessionUser; actor: string }) {
  const [profile, saveProfile, profilePending] = useActionState(profileAction, initial);
  const [password, savePassword, passwordPending] = useActionState(passwordAction, initial);
  const [upgrade, saveUpgrade, upgradePending] = useActionState(becomeWriterAction, initial);
  return (
    <div className="flex flex-col gap-10">
      <form className="flex flex-col gap-4" action={saveProfile}>
        <h2 className="text-xl font-semibold">Profile</h2>
        <TextField label="Display name" name="displayName" defaultValue={user.displayName ?? ""} />
        <TextField label="Pen name" name="penName" defaultValue={user.penName ?? ""} />
        <TextField label="Phone" name="phone" defaultValue={user.phone ?? ""} optional />
        <TextField label="Gender" name="gender" defaultValue={user.gender ?? ""} optional />
        <label className="flex flex-col gap-2 text-sm font-medium">
          Bio
          <textarea className="min-h-24 rounded-2xl border border-black/10 px-4 py-3 dark:border-white/15" name="bio" defaultValue={user.bio ?? ""} maxLength={500} />
        </label>
        <FormError message={profile.error} />
        {profile.message ? <FormNote>{profile.message}</FormNote> : null}
        <SubmitButton>{profilePending ? "Saving…" : "Save profile"}</SubmitButton>
      </form>
      {actor !== "superadmin" ? (
        <form action={modeAction} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Mode</h2>
          <SelectField label="Current mode" name="mode" defaultValue={user.mode}>
            <option value="reader">Reader</option>
            {user.writerSubscription ? <option value="writer">Writer</option> : null}
          </SelectField>
          <SubmitButton>Switch mode</SubmitButton>
        </form>
      ) : null}
      {actor === "reader" && !user.writerSubscription ? (
        <form className="flex flex-col gap-4" action={saveUpgrade}>
          <h2 className="text-xl font-semibold">Become a writer</h2>
          <TextField label="Full name" name="fullName" defaultValue={user.displayName ?? ""} />
          <TextField label="Pen name" name="penName" />
          <TextField label="Gender" name="gender" />
          <TextField label="Phone" name="phone" optional />
          <label className="flex flex-col gap-2 text-sm font-medium">
            Bio
            <textarea className="min-h-24 rounded-2xl border border-black/10 px-4 py-3 dark:border-white/15" name="bio" maxLength={500} />
          </label>
          <FormError message={upgrade.error} />
          <SubmitButton>{upgradePending ? "Saving…" : "Become a writer"}</SubmitButton>
        </form>
      ) : null}
      <form className="flex flex-col gap-4" action={savePassword}>
        <h2 className="text-xl font-semibold">Password</h2>
        <TextField label="Current password" name="currentPassword" type="password" autoComplete="current-password" />
        <TextField label="New password" name="newPassword" type="password" autoComplete="new-password" errors={password.fieldErrors?.newPassword} />
        <FormError message={password.error} />
        {password.message ? <FormNote>{password.message}</FormNote> : null}
        <SubmitButton>{passwordPending ? "Updating…" : "Change password"}</SubmitButton>
      </form>
    </div>
  );
}
