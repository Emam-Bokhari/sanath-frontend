import SavedPage from '@/components/save';
import { apiFetch } from '@/lib/api-fech'

const page = async () => {

  const [favoriteProperties, saveSearches] = await Promise.all([
    apiFetch<any>("/favorite-properties", {
      method: "GET",
      next: {
        tags: ["favorite-properties"],
      },
    }, "server"),
    apiFetch<any>("/saved-searches", {
      method: "GET",
      next: {
        tags: ["save-searches"],
      },
    }, "server")
  ]);

  return (
    <SavedPage favoriteProperties={favoriteProperties.data} saveSearches={saveSearches.data} />
  )
}

export default page
