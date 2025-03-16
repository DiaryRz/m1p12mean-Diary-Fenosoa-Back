// const cookie_config = {
//   path: "/", // This is crucial - makes cookie available to entire domain
//   httpOnly: false, // If you want the cookie to be inaccessible to JavaScript
//   secure: process.env.NODE_ENV !== "development", // Use secure in production
//   sameSite: "None",
//   partitioned: true,
// };

const cookie_config = {
  path: "/", 
  httpOnly: true, // Better for security with tokens
  secure: process.env.NODE_ENV !== "development", // Keep as is
  sameSite: "Lax", // Changed from "None" to "Lax"
};

module.exports = [cookie_config];
