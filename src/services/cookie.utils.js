const cookie_config = {
  path: "/", // This is crucial - makes cookie available to entire domain
  httpOnly: false, // If you want the cookie to be inaccessible to JavaScript
  sameSite: "none",
  secure: true, // Use secure in production
  partitioned: true,
};

function set_xcookie(res, cookie_name, value, cookie_config) {
  res.append("x-cookie", `${cookie_name}=${value}`);
  return res;
}

function get_xcookie(req, cookie_name) {
  const authHeader = req.headers["x-cookie"];
  let res = null;
  if (authHeader) {
    const c = authHeader.split(";");
    c.map((item) => {
      const cookie = item.split("=");
      cookie[0].trim();
      if (cookie[0] == cookie_name) {
        res = cookie[1].trim();
      }
    });
  }
  return res;
}

module.exports = { cookie_config, get_xcookie, set_xcookie };
