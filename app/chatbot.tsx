"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { FaComments } from "react-icons/fa";
import Assistant from "../app/assistant";

const ChatBot = () => {
  // Early return allowed only AFTER all hooks are declared

  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        chatRef.current &&
        !chatRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsChatOpen(false);
      }
    };

    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);
   

  return (
    <div className="relative">
      {
        <>
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsChatOpen((prev) => !prev);
            }}
            className="fixed bottom-14 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <FaComments size={24} />
          </button>
          {/* Chat Widget Panel */}
          {isChatOpen && (
            <div
              ref={chatRef}
              className="fixed bottom-28 z-[99999] right-6 w-80  rounded-xl shadow-xl  flex flex-col items-center justify-center text-gray-700 p-0 border-none"
              style={{ width: "516px", height: "648px" }}
            >
              <Assistant  url_type ="CHECKBOOST" email={"col1234in@yopmail.com"} image={''} sessionId={'345trdfdghgdfsg354'} taxPayload={{
                first_name: "testingg",
                middle_name: "string",
                last_name: "test",
                profile_id: 0,
                "income_type": "salary",
                "annual_salary": 0,
                "hourly_rate": 0,
                "average_hours_per_week": 0,
                "seasonal_variation": "none",
                "estimated_annual_income": 0,
                "filing_status": "single",
                "pay_frequency": "weekly",
                "current_withholding_per_paycheck": 0,
                "desired_boost_per_paycheck": 0,
                "additional_income": 0,
                "deductions": 0,
                "dependents": 0,
                "spouse_income": 0,
                "current_date": "string",
                "paychecks_already_received": 0
              }}
              access_token="eyJraWQiOiJwTVh3bTBEM2ZXa29PN3RGZ2lQa01BcksySHhwOU51TURrbUs2U245NGFvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1NGQ4OTQyOC04MDQxLTcwM2ItNjJlZS0wYTg3ZTU4OGI0ZGEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9zYVM4VXNVSkEiLCJjbGllbnRfaWQiOiIzb3RhbTM1cDVyMXVjb2toczlydGVndjNoYyIsIm9yaWdpbl9qdGkiOiIxMmIwNzI2NC04Mjg0LTRkZGQtYTRjZS0zMzhhOWIyYjBiMzkiLCJldmVudF9pZCI6IjBjYTZjMGFiLWI3MGMtNDQ2OS1iYmNmLThkOTRlN2RiNjkyNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NTgwMjUwMDksImV4cCI6MTc1ODAyODYwOSwiaWF0IjoxNzU4MDI1MDA5LCJqdGkiOiJiMWQxNGRmYS02NTM1LTQ2Y2UtOTFiMS1hMzY4ZWNkODkzNmMiLCJ1c2VybmFtZSI6IjU0ZDg5NDI4LTgwNDEtNzAzYi02MmVlLTBhODdlNTg4YjRkYSJ9.j8zP7wlxE6VpVdrN-lvwgMMOwYZboZUkwbxGnGJ5iwiGyElOdPlowB4ewFcWlCX1kNM5LW0Zj2a41DM1NK0NgaDCDoR0QDtTsdFI9oB9kKFzqrnKOTJ13xvQ4jjXP1eSLBPvcdcPCWWbJGlFDE7GSCb2EQ2R50lETUJoXEi-Qxmo8emTeA65cPmyaBKLtALCqVG9w-_NBTunFmNr75JH1yvl_Ck1EJ0VzjQ48bV6ARKTvRdaPMr5g0qxPRy1Y0Mrfx_zCvoYSgYizPoTsnPn7rY2FiR46wBh6LfQkABbm4mmYC3ZpvA35bus63rTKILme6Ncg67gY7Sp7lFy1o6htA"
              refresh_access_token="eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.KIJVgN93Ldp3oUC07jy87QUlqrj0c9dDuE2IFAaWBR8_qjNGyr6E92LpOLo6QLLdzCUPWNiihw3Q-jV2K7-zNCNsUojlKHMGQk8-eeMNR3smCEjMXqPKn2SZGoh170c3NTeh2t3GW0b7q_IyEbXHJvMp-F0DUEKpfsj4JIdunKiCsCYsooHiIkaZyaaJYbY-kHohMJqUzn_LO1nZl6-eEqYUlxulvmnE986znw3mUwrrufBgtX2V-PxuuVY5fL7KzEzkMaYqEMOCFhw05OHGDlECJ12cScMH16T_b4ecXBL_w1unkub_DHYCcO_M-iVhR7NRILiZP3a9ReZhZ3KCkw.quAsTILFl-dO2xlQ.7Fvy8YdHQuUJ42Tk6clnXbm2ghZ4p1mIz-L5xYmsicfIMWZTSTxMjgs350dE9UoXtJofzPeLW49kZRbfqtuwg4A0cU4W_Z-kGJ8M0JGXjnIdHzvK5LRstxgQqScrYQAD99_gKdAGUin9AJ3-VBHoZjEY-sQYHqXRJMFDCVdBc-RbF2piTwN-eXb4hqlugYBai26JoQLjFmZb6fm-lwTpoWC1hcoEnMXxciQw-1w7C4R2SMBFRSStYwYts_HUAoH04gXvjIdZzIZW1l0D_aykVQ0b33LOlBqWPHO4bzaNq86c3gnMJz_zzN7xTT6N6c2J4qbCsCvJbRnRoegtnmP2QYMHTPATU2V-EEma-yN6dkym0OxBW8M0knI8fwCVllQeCkSoGUT_Lyxvgm-DyvhDpmUy9NkFOn04DsmBC9cB8uZbAJV5-Fjog-wEEXkRobNLrBerJATuh5zxJsqMQnDuR6HyCQ5MknIbiwkfgiQifTgntc-BQ2wMCe7ieZCAiR8vNmFe4KUD9noFPsC5Ib94DMWmsBFs-nNDUkHvm8KIR__7FYFlqfYzl748JJBfkE0Ril-m_Gt5Qv1rHOZqAe8R4D0CeV8pEAinXgOmrY0sMHemYXJQSQnjRrktTq6nrjAiVLiAh18vxUP50cVYOc9EIwoltgkPEiijKmCUrBxqhA1iWOnoQIIWFILxCG34u5RJk_5qidOMeReGVycbH9OvbHQHkAKC-CKOpJ1nRBF3SpnCiyLYMx9evhW0VlQSJi8a34zwPHm0xwKeaQ2-vWSp6QBg36VCjUA4Md2T6nWQHOQbNNyf6FR930qxVp5mWb4iZP_r5jKCrFu5Sg2T0ROssDEwib-N-W5RhoDLXWgrUU2OTBXCFd1Ob2wgMfODcnb6tN9TYGltA2C6SQOfj1tn4oYYjXt0Vu6Ob8RajeRh6sMuxqmsNalIM4_aYULiv8uJwetxDE9YF3LNW61UXKQiXYQSt0ChioS-9c_BWv5n6kqYbE4seZGX5XblqUe3wur-N7zfe2nzWOUb0s2r9xc_3PLsQcsRmmdBXNIxxUnITGrxqypQEjrPshnJ6PlAiJeRnLZGpfRNIGrQk4cZalA8J878_0s-_NWazJo_sptxyW6TXfJVaz41m5ESprp7nQNYINW8ccg3Bv2toEHCHqYVK6amGQD6AbeIoRb29RWe1W0pxkMMjNfVPFQ7bSSl2Pe_5-gxaDJGtvUZLEgaVSqbYuEYsW7ol5qkyoPXa7WQk9veZyOnV4Yy01zayw1WAWjCyZvkkG3uGw1-MXk0i9PPzw5j6jOlp25pqRkBE60k7HCahEvZTNW2m6y_sgo.DPzY_vgyVeKA536bHuxAGg"
              />
            </div>
          )}
        </>
      }
    </div>
  );
};

export default ChatBot;
