"use client";
import React, { useCallback, useEffect, useState } from "react";

import Spinner from "../../components/LoadingSpinner";
import { getAlumniInfo } from "@/graphql/backend";

const Alumni: React.FC = () => {
  interface AlumniData {
    name: string;
    current_position: string;
    current_company: string;
    graduation_year: string;
  }

  const [alumniData, setAlumniData] = useState<AlumniData[]>([]);
  const [filteredData, setFilteredData] = useState<AlumniData[]>([]);
  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const perPage: number = 15;

  const filterData = useCallback(() => {
    const filtered = alumniData.filter(
      (row) =>
        row.name.toLowerCase().includes(name.toLowerCase()) &&
        row.current_position.toLowerCase().includes(position.toLowerCase()) &&
        row.current_company.toLowerCase().includes(company.toLowerCase())
    );
    setFilteredData(filtered);
    setPage(1);
  }, [alumniData, name, position, company]);

  useEffect(() => {
    getAlumniInfo()
      .then((data: AlumniData[]) => {
        data.sort((a: AlumniData, b: AlumniData) => {
          const aLastName = a.name.split(" ").at(-1) || "";
          const bLastName = b.name.split(" ").at(-1) || "";
          if (aLastName < bLastName) return -1;
          if (aLastName > bLastName) return 1;
          return 0;
        });
        setAlumniData(data);
        setFilteredData(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const getPaginatedData = () => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const inputStyle =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (loading) {
    return (
      <div className="p-8 bg-gray-50">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          Alumni List
        </h3>
        <p className="mt-4 text-center text-gray-600">
          Below is a list of alumni who have been a part of Silver Fund. Feel
          free to filter by name, position, and company to find specific alumni.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-center border border-gray-300">Alumni</th>
                <th className="text-center border border-gray-300">
                  Current Position
                </th>
                <th className="text-center border border-gray-300">
                  Current Company
                </th>
                <th className="text-center border border-gray-300">
                  Graduation Year
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex justify-center items-center mt-8">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-8 bg-gray-50">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          Alumni List
        </h3>
        <p className="mt-4 text-center text-gray-600">
          Below is a list of alumni who have been a part of Silver Fund. Feel
          free to filter by name, position, and company to find specific alumni.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-center border border-gray-300">Alumni</th>
                <th className="text-center border border-gray-300">
                  Current Position
                </th>
                <th className="text-center border border-gray-300">
                  Current Company
                </th>
                <th className="text-center border border-gray-300">
                  Graduation Year
                </th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th className="text-center border border-gray-300">
                  <input
                    type="text"
                    placeholder="Name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                    className={inputStyle}
                  />
                </th>
                <th className="text-center border border-gray-300">
                  <input
                    type="text"
                    placeholder="Position"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPosition(e.target.value)
                    }
                    className={inputStyle}
                  />
                </th>
                <th className="text-center border border-gray-300">
                  <input
                    type="text"
                    placeholder="Company"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCompany(e.target.value)
                    }
                    className={inputStyle}
                  />
                </th>
                <th className="text-center border border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedData().map((row) => (
                <tr
                  key={row.name}
                  className="hover:bg-gray-100"
                  style={{ padding: "10px" }}
                >
                  <td className="text-center border border-gray-300 p-4">
                    {row.name}
                  </td>
                  <td className="text-center border border-gray-300 p-4">
                    {row.current_position}
                  </td>
                  <td className="text-center border border-gray-300 p-4">
                    {row.current_company}
                  </td>
                  <td className="text-center border border-gray-300 p-4">
                    {row.graduation_year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {Math.ceil(filteredData.length / perPage)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === Math.ceil(filteredData.length / perPage)}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alumni;
