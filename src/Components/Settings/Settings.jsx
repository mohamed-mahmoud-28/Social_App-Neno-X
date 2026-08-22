import { LuLogOut } from "react-icons/lu";
import ChangeProfilePhoto from "../ChangeProfilePhoto/ChangeProfilePhoto";
import ChangeCoverPhoto from "../ChangeCoverPhoto/ChangeCoverPhoto";
import ChangePassword from "../ChangePassword/ChangePassword";
import { useLogout } from "../../Hooks/useLogout";

export default function Setting() {
  const logout = useLogout();

  return (
    <section className="min-h-screen px-4 py-8 sm:px-5 lg:px-8">

      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your profile and account settings
          </p>
        </div>

        {/* Settings */}
        <div className="space-y-6">

          <ChangeProfilePhoto />

          <ChangeCoverPhoto />

          <ChangePassword />

          <section className="rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50/70 p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <LuLogOut size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Logout
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    End your current session on this device.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.98]"
              >
                <LuLogOut size={17} />
                Logout
              </button>
            </div>
          </section>
        </div>

      </div>

    </section>
  );
}
