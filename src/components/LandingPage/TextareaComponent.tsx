'use client';

import { Textarea, Button } from 'flowbite-react';

function TextareaComponent() {
  return (
    <div className="w-full">
      <form className="flex-col gap-4">
        <div className="mb-2 block">
          <h5 className="text-2xl md:text-4xl font-bold text-white dark:text-white text-center mt-20">
            Report Traffic Accident
          </h5>
          <Textarea
            className="mx-auto w-2/3 py-3 bg-transparent border-white  mt-5 text-white"
          />
          <Button type="submit" className="mx-auto mt-4 bg-transparent hover:bg-white font-semibold text-white hover:text-black">Submit</Button>
        </div>
      </form>
    </div>
  );
}

export default TextareaComponent;
