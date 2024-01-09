// Custom Reusable Response Function
const Response = (res, success, message, status, data = null) => {
  return res.status(status).json({
    success: success,
    message: message ? message : undefined,
    data: data ? data : undefined,
  });
};

export default Response;
