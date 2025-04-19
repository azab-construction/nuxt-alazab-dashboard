export function useStores() {
  const stores = useState("stores", () => []);

  const fetchStores = async () => {
    // جلب بيانات الفروع من API
  };

  return { stores, fetchStores };
}
