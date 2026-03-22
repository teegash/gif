from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_positive_crypto_headline():
    response = client.post(
        "/score",
        json={
            "articles": [
                {
                    "id": "1",
                    "text": "Bitcoin surges to all-time high amid institutional adoption wave",
                }
            ]
        },
    )
    data = response.json()
    assert data["avgScore"] > 0.2
    assert data["dominantLabel"] == "positive"


def test_negative_crypto_headline():
    response = client.post(
        "/score",
        json={
            "articles": [
                {
                    "id": "1",
                    "text": "Crypto exchange collapses in massive bankruptcy fraud scandal",
                }
            ]
        },
    )
    data = response.json()
    assert data["avgScore"] < -0.2
    assert data["dominantLabel"] == "negative"


def test_batch_scoring_returns_correct_counts():
    response = client.post(
        "/score",
        json={
            "articles": [
                {"id": "1", "text": "Bitcoin rallies bullish breakout"},
                {"id": "2", "text": "Crypto market crash liquidation wave"},
                {"id": "3", "text": "Market analysts discuss quarterly trends"},
            ]
        },
    )
    data = response.json()
    assert data["positiveCount"] >= 1
    assert data["negativeCount"] >= 1
    assert data["articleCount"] == 3
