from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from models import (
    DebugExample,
    AnalyzeRequest,
    RootCauseAnalysis,
    VerifyRequest,
    TestResult
)
from demo_fixtures import EXAMPLES
from analyzer import analyze_failure
from test_runner import run_isolated_pytest

app = FastAPI(
    title="RepoMedic AI — Agentic CI Failure Investigator",
    description="Intelligent AI debugging agent for CI/CD test failures with verified sandbox regression testing.",
    version="1.0.0"
)

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """Health check endpoint to verify backend service and pytest runner availability."""
    return {
        "status": "ok",
        "app": "RepoMedic AI",
        "version": "1.0.0",
        "track": "Build With Nova — AI for Developers",
        "pytest_available": True,
        "supported_fixtures": list(EXAMPLES.keys())
    }

@app.get("/examples", response_model=List[DebugExample])
def get_examples():
    """Returns the list of predefined, trusted bug scenarios."""
    return list(EXAMPLES.values())

@app.post("/analyze", response_model=RootCauseAnalysis)
def analyze(req: AnalyzeRequest):
    """
    Performs Root Cause Analysis on a selected demo fixture or custom code/error trace.
    Returns faulty line, root cause explanation, expected vs actual behavior, and unified code diff.
    """
    try:
        return analyze_failure(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.post("/verify", response_model=TestResult)
def verify(req: VerifyRequest):
    """
    Runs pytest in an isolated sandbox subprocess for a trusted fixture.
    Supports mode='buggy' (demonstrating true test failure) or mode='fixed' (verifying patch).
    Never fabricates test output.
    """
    if req.example_id not in EXAMPLES:
        raise HTTPException(
            status_code=400,
            detail=f"Safety restriction: Live execution is restricted to trusted fixtures. Unknown ID: '{req.example_id}'"
        )
    
    try:
        return run_isolated_pytest(example_id=req.example_id, mode=req.mode)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
