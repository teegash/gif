from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re

app = FastAPI(title="Sentiment Engine", version="1.0.0")
analyzer = SentimentIntensityAnalyzer()

FINANCIAL_LEXICON = {
    "bullish": 3.0,
    "rally": 2.5,
    "breakout": 2.5,
    "surge": 2.8,
    "soar": 2.8,
    "moon": 2.0,
    "all-time high": 3.0,
    "ath": 2.5,
    "accumulation": 1.5,
    "adoption": 2.0,
    "institutional": 1.5,
    "etf approval": 3.0,
    "halving": 1.5,
    "bearish": -3.0,
    "crash": -3.5,
    "plunge": -3.0,
    "collapse": -3.5,
    "hack": -3.5,
    "exploit": -3.0,
    "liquidation": -3.0,
    "bankruptcy": -3.5,
    "fraud": -3.5,
    "ban": -2.5,
    "regulation crackdown": -2.5,
    "sec lawsuit": -3.0,
    "dump": -2.5,
    "rug pull": -4.0,
    "delistment": -3.0,
    "delisted": -3.0,
    "money laundering": -3.5,
    "uncertainty": -1.0,
    "volatility": -0.5,
    "correction": -1.5,
    "pullback": -1.0,
    "retracement": -0.5,
}

analyzer.lexicon.update(FINANCIAL_LEXICON)


class ArticleInput(BaseModel):
    id: str
    text: str


class SentimentResult(BaseModel):
    id: str
    compound: float
    positive: float
    neutral: float
    negative: float
    label: str
    score: float


class BatchSentimentRequest(BaseModel):
    articles: List[ArticleInput]


class BatchSentimentResponse(BaseModel):
    results: List[SentimentResult]
    avgScore: float
    dominantLabel: str
    positiveCount: int
    negativeCount: int
    neutralCount: int
    articleCount: int


def clean_text(text: str) -> str:
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^\w\s\-\/]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text.lower()


def classify_label(compound: float) -> str:
    if compound >= 0.05:
        return "positive"
    if compound <= -0.05:
        return "negative"
    return "neutral"


@app.post("/score", response_model=BatchSentimentResponse)
async def score_batch(request: BatchSentimentRequest):
    if not request.articles:
        raise HTTPException(status_code=400, detail="No articles provided")

    results: List[SentimentResult] = []
    scores: List[float] = []

    for article in request.articles:
        cleaned = clean_text(article.text)
        vs = analyzer.polarity_scores(cleaned)
        label = classify_label(vs["compound"])

        result = SentimentResult(
            id=article.id,
            compound=vs["compound"],
            positive=vs["pos"],
            neutral=vs["neu"],
            negative=vs["neg"],
            label=label,
            score=vs["compound"],
        )
        results.append(result)
        scores.append(vs["compound"])

    avg_score = sum(scores) / len(scores) if scores else 0.0
    positive_count = sum(1 for item in results if item.label == "positive")
    negative_count = sum(1 for item in results if item.label == "negative")
    neutral_count = sum(1 for item in results if item.label == "neutral")

    return BatchSentimentResponse(
        results=results,
        avgScore=round(avg_score, 4),
        dominantLabel=classify_label(avg_score),
        positiveCount=positive_count,
        negativeCount=negative_count,
        neutralCount=neutral_count,
        articleCount=len(request.articles),
    )


@app.get("/health")
async def health():
    return {"status": "ok", "service": "sentiment-engine"}

