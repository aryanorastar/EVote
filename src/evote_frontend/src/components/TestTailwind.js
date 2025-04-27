import React from 'react';

const TestTailwind = () => {
  return (
    <div className="flex flex-col items-center p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary-600 mb-6">
        Tailwind CSS Test
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Card Component</h2>
          <p className="text-gray-600">
            This card uses the custom card component class from our Tailwind setup.
          </p>
          <div className="mt-4">
            <button className="btn btn-primary">Primary Button</button>
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Direct Tailwind Classes</h2>
          <p className="text-gray-600">
            This card uses direct Tailwind utility classes without custom components.
          </p>
          <div className="mt-4">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              Tailwind Button
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-primary-50 rounded-md w-full">
        <h2 className="text-xl font-semibold mb-3">Color Palette</h2>
        <div className="grid grid-cols-5 gap-2">
          <div className="h-12 bg-primary-50 rounded-md flex items-center justify-center">50</div>
          <div className="h-12 bg-primary-100 rounded-md flex items-center justify-center">100</div>
          <div className="h-12 bg-primary-200 rounded-md flex items-center justify-center">200</div>
          <div className="h-12 bg-primary-300 rounded-md flex items-center justify-center">300</div>
          <div className="h-12 bg-primary-400 rounded-md flex items-center justify-center">400</div>
          <div className="h-12 bg-primary-500 rounded-md flex items-center justify-center text-white">500</div>
          <div className="h-12 bg-primary-600 rounded-md flex items-center justify-center text-white">600</div>
          <div className="h-12 bg-primary-700 rounded-md flex items-center justify-center text-white">700</div>
          <div className="h-12 bg-primary-800 rounded-md flex items-center justify-center text-white">800</div>
          <div className="h-12 bg-primary-900 rounded-md flex items-center justify-center text-white">900</div>
        </div>
      </div>
      
      <div className="mt-8 w-full">
        <h2 className="text-xl font-semibold mb-3">Typography & Links</h2>
        <p className="mb-2">The base font is set to <span className="font-bold">Poppins</span>.</p>
        <p className="mb-4">
          This is a paragraph with a <a href="#" className="link">styled link</a> using our custom link class.
        </p>
        
        <div className="flex space-x-4 mt-6">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-outline">Outline</button>
        </div>
      </div>
    </div>
  );
};

export default TestTailwind;
