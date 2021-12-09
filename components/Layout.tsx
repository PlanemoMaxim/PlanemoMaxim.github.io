import React, { Fragment, SVGProps } from "react";

const Layout: React.FC<{}> = ({ children }) => {
  return (
    <div className="bg-white">
      <main className="bg-indigo-50" id="mint">
        {children}
      </main>
    </div>
  );
};

export default Layout;
