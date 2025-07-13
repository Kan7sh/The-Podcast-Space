// "use server";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { getUserRecordings } from "@/feature/user/db/user";

// export default async function UserRecordings({ userId }: { userId: number }) {
//   const recordings = await getUserRecordings(userId);

//   return (
//     <div className="h-screen w-screen flex flex-col items-center justify-center">
//       Past recordings
//       {recordings.map((recording) => {
//         return (
//           <Card>
//             <div className="flex flex-row justify-between">
//               <div className="flex flex-row ">
//                 <div className="text-xl font-semibold text-white">
//                   {recording.roomName}
//                 </div>
//                 <div className="text-gray-600">{recording.duration}</div>
//                 <div className="text-gray-600">
//                   {recording.createdAt?.toISOString()}
//                 </div>
//               </div>
//               <div>
//                 <Button>Download</Button>
//               </div>
//             </div>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }
