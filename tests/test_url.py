"""Tests for Nightscout URL normalization."""

import pytest

from custom_components.nightscout.url import normalize_nightscout_url


def test_normalize_adds_https() -> None:
    assert normalize_nightscout_url("example.com/ns", allow_http=False) == "https://example.com/ns"


def test_normalize_preserves_https() -> None:
    assert normalize_nightscout_url("https://x.example/", allow_http=False) == "https://x.example"


def test_http_requires_flag() -> None:
    with pytest.raises(ValueError, match="http_not_allowed"):
        normalize_nightscout_url("http://local/ns", allow_http=False)


def test_http_allowed_when_flag_set() -> None:
    assert normalize_nightscout_url("http://local/ns", allow_http=True) == "http://local/ns"
