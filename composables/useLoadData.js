const dataRef = ref({});
const pending = ref(false);
const error = ref(null);

export const useLoadData = () => {
  const initLoad = async () => {
    try {
      const {
        data,
        pending: p,
        error: e,
      } = await useAsyncData("all-data", () => $fetch("/api/all"));
      dataRef.value = data.value;
      pending.value = p.value;
      error.value = e.value;
    } catch (err) {
      console.error("Fejl ved initLoad", err);
      error.value = err;
    }
  };

  const loadData = async () => {
    pending.value = true;
    error.value = null;
    try {
      // $fetch kører kun når DU kalder loadData()
      const res = await $fetch("/api/all");
      dataRef.value = res;
    } catch (err) {
      console.error("Kunne ikke hente /api/all", err);
      error.value = err;
    } finally {
      pending.value = false;
    }
  };

  return { dataRef, pending, error, loadData, initLoad };
};
