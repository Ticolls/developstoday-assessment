export async function getCountry(code: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/country/${code}`);
    if (!res.ok) {
        throw new Error("Failed to fetch country");
    }
    return await res.json();
  }

export async function getCountries() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/country/available`);
    if (!res.ok) {
      throw new Error("Failed to fetch countries");
    }
    return res.json();
  }