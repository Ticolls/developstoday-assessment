import Link from "next/link";
import { getCountries } from "./services/api";

type Country = {
  countryCode: string;
  name: string;
};

export default async function Home() {
  const countries = await getCountries();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Countries of the World</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {countries.map((country: Country) => (
          <Link
            href={`/country/${country.countryCode}`}
            key={country.countryCode}
            className="block p-4 border rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className="font-semibold">{country.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
