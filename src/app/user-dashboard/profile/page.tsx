import AccountSettingsPage from '@/components/UserDashboard/AccountSetting'
import { apiFetch } from '@/lib/api-fech'

const page = async () => {

  const response = await apiFetch<any>("/users/profile", {
    method: "GET",
    next: {
      tags: ["profile"],
    },
  }, "server");

  return (
    <div className="max-w-7xl">
      <AccountSettingsPage profile={response.data} />
    </div>
  )
}

export default page
