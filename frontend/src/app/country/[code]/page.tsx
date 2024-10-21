"use client"

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getCountry } from '@/app/services/api';
import Image from 'next/image';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type BorderCountry = {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: BorderCountry[] | null;
};

type PopulationData = {
  year: number;
  value: number;
};

type CountryInfo = {
  name: string;
  borders: BorderCountry[];
  populationHistory: PopulationData[];
  flagUrl: string;
};

export default function CountryInfo({ params }: { params: { code: string } }) {
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountry() {
      try {
        const countryData = await getCountry(params.code);
        setCountryInfo(countryData);
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
    )
  }

  if (!countryInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-semibold">Country information not found</div>
      </div>
      )
  }

  const populationYears = countryInfo.populationHistory.map((pop) => pop.year);
  const populationValues = countryInfo.populationHistory.map((pop) => pop.value);

  const chartData = {
    labels: populationYears,
    datasets: [
      {
        label: 'Population over time',
        data: populationValues,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Country Info</h1>

      <div className="flex items-center mb-6">
        <Image src={countryInfo.flagUrl} width={50} height={50} alt="Country flag" className="w-20 h-12 mr-4" />
        <h2 className="text-2xl font-semibold">{countryInfo.name}</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Bordering Countries</h3>
        <ul>
          {countryInfo.borders.map((borderCountry) => (
            <li key={borderCountry.countryCode}>
              <a href={`/country/${borderCountry.countryCode}`} className="text-blue-500 hover:underline">
                {borderCountry.commonName}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Population Over Time</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
}
