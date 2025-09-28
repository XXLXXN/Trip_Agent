"use client";

import React from "react";
import { ScrollableContent, Card } from "../../components";

export default function SuggestionsPage() {
  return (
    <ScrollableContent className="px-4">
      {/* Header Section */}
      <div className="py-4">
        <h2 className="text-[#1B1446] font-semibold text-[18px] leading-[22px] mb-2" style={{ fontFamily: 'Inter' }}>建议</h2>
        <p className="text-[#808080] text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>
          You can make a request to download or delete your personal data from Travely.
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-4">
        {/* Request Personal Data */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-[#1B1446] font-semibold text-[14px] leading-[17px] mb-1" style={{ fontFamily: 'Inter' }}>
                Request your personal data
              </h3>
              <p className="text-[#808080] text-[12px] leading-[15px]" style={{ fontFamily: 'Inter' }}>
                We'll create a file for you to download your personal data.
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="#0768FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Card>

        {/* Delete Account */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-[#1B1446] font-semibold text-[14px] leading-[17px] mb-1" style={{ fontFamily: 'Inter' }}>
                Delete your account
              </h3>
              <p className="text-[#808080] text-[12px] leading-[15px]" style={{ fontFamily: 'Inter' }}>
                By doing this your account and data will permanently deleted.
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="#0768FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Card>
      </div>
    </ScrollableContent>
  );
}
