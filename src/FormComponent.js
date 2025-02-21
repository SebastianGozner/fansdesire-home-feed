import React, { useState } from 'react';

const FormComponent = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Input 1:', input1);
    console.log('Input 2:', input2);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="input1" className="block text-gray-700 font-bold mb-2">Input 1</label>
          <input
            id="input1"
            type="text"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="input2" className="block text-gray-700 font-bold mb-2">Input 2</label>
          <input
            id="input2"
            type="text"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;