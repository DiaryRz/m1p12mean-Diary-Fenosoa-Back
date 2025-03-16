const cookie_config = {
  path: "/",
  httpOnly: false, // Allow JavaScript to access the cookie
  secure: process.env.NODE_ENV === "production", // Secure in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Adjust SameSite based on environment
  partitioned: process.env.NODE_ENV === "production", // Secure in production
};

module.exports = [cookie_config];
