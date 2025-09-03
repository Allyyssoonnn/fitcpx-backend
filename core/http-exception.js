class HttpException extends Error {
   constructor(status, message) {
      super(message);
      this.status = status;
   }
}

// * 400 BAD REQUEST
// * 401 UNAUTHORIZED
// * 403 FORBIDDEN
// * 404 NOT FOUND

// * 500 SERVER ERROR
// * 502 BAD GATEWAY
// * 503 SERVICE UNAVALIABLE

module.exports = HttpException;
