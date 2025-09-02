class Response {
  static success(res, data) {
    return res.status(200).json({ success: true, data });
  }
  static created(res, data) {
    return res.status(201).json({ success: true, data });
  }
  static noContent(res) {
    return res.status(204).send();
  }
}
module.exports = Response;
