export function validateCreatePaste(body: any) {
  if (!body?.content || typeof body.content !== "string") {
    return "content is required";
  }

  if (body.ttl_seconds !== undefined) {
    if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
      return "ttl_seconds must be >= 1";
    }
  }

  if (body.max_views !== undefined) {
    if (!Number.isInteger(body.max_views) || body.max_views < 1) {
      return "max_views must be >= 1";
    }
  }

  return null;
}
