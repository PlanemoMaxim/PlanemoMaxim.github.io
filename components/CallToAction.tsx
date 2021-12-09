import React from "react";
import Image from "next/image";

import arbicatsCover from "../public/arbicats_cover.jpeg";

interface Props {
  activateMetamask: () => void;
  mint: () => void;
  disabled: boolean;
}

const CallToAction: React.FC<Props> = ({
  activateMetamask,
  mint,
  disabled,
}) => {
  return (
    <>
      <div className="max-w-7xl mx-auto rounded-3xl bg-white">
        <Image
          layout="responsive"
          src={arbicatsCover}
          className="object-cover object-center rounded-3xl shadow-2xl"
          alt=""
        />
      </div>

      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            <span className="block text-cyan-600">Mint your own Arbicat</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="mx-auto flex space-x-4">
              <button
                disabled={disabled}
                onClick={mint}
                className="block w-full py-3 px-12 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 "
              >
                Mint
              </button>
              <button
                onClick={activateMetamask}
                className="block w-full py-3 px-8 rounded-md shadow bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:from-teal-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 "
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallToAction;
