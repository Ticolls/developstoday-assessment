"use client"

import { getCountry } from "@/app/services/api";
import { useEffect, useState } from "react";

type CountryInfo = {
    borders: [],
    populationHistory: [],
    flagUrl: string
}

export default function CountryInfo({ params }: { params: { code: string } }) {
  const [country, setCountry] = useState<CountryInfo>();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function fetchCountry() {
      try {
        const countryData = await getCountry(params.code);
        setCountry(countryData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCountry();
  }, [params.code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{country?.flagUrl}</h1>
      {/* Renderize as informações do país */}
    </div>
  );
}
