import React, { useState } from "react";
import { cars } from './table-data';
import { dropdown } from './dropdown-data';

export default function Table() {
    const [isDropdownVisible, setIsDropdownVisible] = useState(null);

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <table className="min-w-96 text-left text-sm font-light text-gray-300">
                        <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                            <th scope="col" className="px-6 py-4">Model</th>
                            <th scope="col" className="px-6 py-4">Engine</th>
                            <th scope="col" className="px-6 py-4">Horsepower</th>
                            <th scope="col" className="px-6 py-4">Details</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cars.map((car, index) => (
                            <React.Fragment key={index}>
                                <tr className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                                    <td className="whitespace-nowrap px-6 py-4">{car.model}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{car.engine}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{car.horsepower}</td>
                                    <td
                                        className="whitespace-nowrap px-6 py-4 cursor-pointer"
                                        onClick={() =>
                                            setIsDropdownVisible(isDropdownVisible === index ? null : index)
                                        }
                                    >
                                        {isDropdownVisible === index ? '⌄' : '<'}
                                    </td>
                                </tr>

                                {isDropdownVisible === index && (
                                    <tr className="border-b transition duration-300 ease-in-out hover:bg-gray-500 dark:border-neutral-500">
                                        <td colSpan="4" className="px-6 py-4 bg-gray-600 rounded-b-lg">
                                            <p><b className='text-green-600'>Pros: </b>{dropdown[index]?.pros || "No data"}</p>
                                            <p><b className='text-red-600'>Cons: </b>{dropdown[index]?.cons || "No data"}</p>
                                        </td>
                                    </tr>

                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
