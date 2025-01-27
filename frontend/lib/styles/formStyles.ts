// Shared form styles for consistent purple theme
// export const formStyles = {
//   card: "bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-black border-purple-700/30 backdrop-blur-sm shadow-[0_0_50px_-12px] shadow-purple-500/30",
//   input: "bg-gradient-to-r from-purple-900/40 to-purple-800/40 border-purple-600/40 text-white placeholder:text-purple-300/50 focus-visible:ring-purple-500/50 focus-visible:ring-offset-0 focus-visible:border-purple-500/50 shadow-inner shadow-purple-950/20",
//   button: {
//     primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-900/50 text-white font-medium",
//     ghost: "text-purple-300 hover:text-white hover:bg-purple-900/50"
//   },
//   label: "text-sm font-medium text-purple-200 mb-2",
//   heading: "font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
// };

export const formStyles = {
  card: "bg-black border-gray-400 backdrop-blur-sm shadow-[0_0_50px_-12px] shadow-purple-500/30", // Changed to white with a border
  input: "bg- border-gray-400 text-black placeholder:text-gray-500", // Lighter background
  button: {
    primary: "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-400 hover:to-green-400 transition-all duration-300 shadow-lg text-white font-medium",
    ghost: "text-gray-700 hover:text-white hover:bg-gray-800/50"
  },
  label: "text-sm font-bold text-black-700 mb-2", // Changed to gray
  heading: "font-bold text-gray-800" // Changed to gray
};