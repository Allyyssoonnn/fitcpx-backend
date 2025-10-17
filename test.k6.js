import http from "k6/http";

export const options = {
   vus: 300,
   duration: "120s",
   // stages: [
   //    { duration: "2m", target: 10 },
   //    { duration: "2m", target: 30 },
   //    { duration: "2m", target: 50 },
   //    { duration: "2m", target: 80 },
   //    { duration: "2m", target: 120 },
   //    { duration: "2m", target: 0 },
   // ],
   thresholds: {
      http_req_failed: ["rate<0.01"], // http errors should be less than 1%
      http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
   },
};

export default function () {
   const url = "https://api.fitcpx.com/admin/clients";
   const payload = JSON.stringify({});

   const params = {
      headers: {
         "Content-Type": "application/json",
      },
   };

   http.get(url, payload, params);
}
