import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Camera, Save, Lock, Mail, User, Shield, Loader } from 'lucide-react'
import useAuthStore from '../../../../store/useAuthStore'
import { fetchProfile, updateProfile, changePassword } from '../../service'
import { notifySuccess, notifyError } from '../../../../lib/notify'

function ProfileSettingsPage() {
  const { user, initials } = useOutletContext()
  const setUser = useAuthStore(s => s.setUser)

  const [name, setName]                       = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [loading, setLoading]                 = useState(true)
  const [saving, setSaving]                   = useState(false)

  const email = user?.email || ''

  // ── Load profile from /profile ──────────────────────────────────────────
  useEffect(() => {
    fetchProfile()
      .then(p => setName(p.displayName || user?.name || ''))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    if (!name.trim()) {
      notifyError('Name cannot be empty.')
      return
    }
    const wantsPasswordChange = currentPassword || newPassword
    if (wantsPasswordChange && (!currentPassword || !newPassword)) {
      notifyError('Enter both your current and new password.')
      return
    }

    setSaving(true)
    try {
      await updateProfile({ displayName: name.trim() })
      const fresh = await fetchProfile()
      const current = useAuthStore.getState().user
      setUser({ ...current, name: fresh.displayName || current?.name || name })

      if (wantsPasswordChange) {
        await changePassword(currentPassword, newPassword)
        setCurrentPassword('')
        setNewPassword('')
      }

      notifySuccess(
        wantsPasswordChange
          ? 'Profile and password updated successfully.'
          : 'Profile updated successfully.',
      )
    } catch (err) {
      notifyError(err.response?.data?.message || 'Could not update profile.')
    } finally {
      setSaving(false)
    }
  }

  const inputBase =
    'h-11 w-full rounded-lg border border-[#d1d5db] bg-[#f9fafb] pl-10 pr-3 text-[13px] text-[#191c1d] outline-none transition placeholder:text-[#9ca3af] focus:border-[#8c6a40] focus:bg-white focus:ring-2 focus:ring-[#8c6a40]/15'

  return (
    <div className="mx-auto w-full max-w-[800px] px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-[22px] font-bold text-[#191c1d]">Profile Settings</h2>
        <p className="mt-1 text-[13px] text-[#747878]">
          Manage your account preferences, security, and personal information.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-[13px] text-[#747878]">
            <Loader className="h-4 w-4 animate-spin" /> Loading profile…
          </div>
        ) : (
          <>
            {/* Photo section */}
            <div className="mb-8 flex items-center gap-6">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#a07d4e] to-[#8c6a40] text-[26px] font-bold text-white shadow-md">
                  {initials}
                </div>
                <button
                  type="button"
                  title="Upload new photo"
                  onClick={() => notifyError('Photo upload is not supported.')}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#191c1d] text-white transition hover:scale-110 hover:bg-[#8c6a40]"
                >
                  <Camera className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#191c1d]">Profile Photo</h3>
                <p className="text-[12px] text-[#747878]">
                  Update your dashboard avatar. Recommended size: 256×256px.
                </p>
              </div>
            </div>

            {/* Name + email */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-2 text-[12px] font-semibold text-[#374151]">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 h-4 w-4 text-[#9ca3af]" strokeWidth={1.8} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 flex items-center justify-between text-[12px] font-semibold text-[#374151]">
                  Email Address
                  <span className="rounded bg-[#fee2e2] px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-[#dc2626]">
                    READ-ONLY
                  </span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-[#9ca3af]" strokeWidth={1.8} />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="h-11 w-full cursor-not-allowed rounded-lg border border-[#e5e7eb] bg-[#f3f4f6] pl-10 pr-3 text-[13px] text-[#747878]"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#9ca3af]">
                  Your email is tied to your institutional ID and cannot be changed.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-[#e5e7eb]" />

            {/* Password & Security */}
            <div className="mb-6 flex items-center gap-2 text-[14px] font-bold text-[#191c1d]">
              <Shield className="h-[18px] w-[18px]" strokeWidth={1.8} />
              Password &amp; Security
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-2 text-[12px] font-semibold text-[#374151]">Current Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-[#9ca3af]" strokeWidth={1.8} />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={inputBase}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-[12px] font-semibold text-[#374151]">New Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-[#9ca3af]" strokeWidth={1.8} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#8c6a40] px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#7a5c35] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? <Loader className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                  : <Save className="h-4 w-4" strokeWidth={1.8} />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileSettingsPage
