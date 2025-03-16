const cookie_config = {
  path: "/", // This is crucial - makes cookie available to entire domain
  httpOnly: false, // If you want the cookie to be inaccessible to JavaScript
  // secure: process.env.NODE_ENV !== "development", 
  secure: true, 
  sameSite: "None",
  partitioned: true,
};

module.exports = [cookie_config];
