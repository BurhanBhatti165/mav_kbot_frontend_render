// export default function Spinner() {
//   return (
//     <div className="flex items-center justify-center h-40">
//       <div className="w-8 h-8 border-4 border-t-transparent border-[#00ff88] border-solid rounded-full animate-spin"></div>
//     </div>
//   );
// }

import "../styles/spinner.css";  // ✅ import CSS (no default export here)

export default function Spinner() {
  return (
    <span className="loader"></span>  // ✅ use className instead of class
  );
}

