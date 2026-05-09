"""Nightscout URL normalization (no Home Assistant imports)."""


def normalize_nightscout_url(url: str, *, allow_http: bool) -> str:
    """Strip whitespace, add scheme if missing, optionally forbid plain HTTP."""
    raw = url.strip().rstrip("/")
    if not raw.startswith(("http://", "https://")):
        raw = f"https://{raw}"
    if raw.startswith("http://") and not allow_http:
        raise ValueError("http_not_allowed")
    return raw
