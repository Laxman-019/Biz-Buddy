import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#003C43] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Top Section */}
        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
            gap-6 sm:gap-8
            text-center sm:text-left
          "
        >
          {/* Brand */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#57A6A1]">
              BizBuddy
            </h2>
          </div>

          {/* Wrapper ONLY for mobile */}
          <div className="grid grid-cols-2 gap-6 items-start sm:contents">
            {/* Company */}
            <div className="text-left pl-13 sm:pr-0">
              <h3 className="text-sm font-semibold text-[#57A6A1] mb-2">
                Company
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/about" className="hover:text-[#57A6A1] ">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#57A6A1] ">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-left pl-6 sm:pl-0">
              <h3 className="text-sm font-semibold text-[#57A6A1] mb-2">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/privacy-policy" className="hover:text-[#57A6A1] ">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#57A6A1] ">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="hover:text-[#57A6A1] ">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="
            border-t border-[#577B8D]
            mt-6 sm:mt-8
            pt-4
            text-center
            text-xs sm:text-sm
            text-gray-400
          "
        >
          © {new Date().getFullYear()} BizBuddy | Created by BizBuddy Team
        </div>
      </div>
    </footer>
  );
};

export default Footer;
