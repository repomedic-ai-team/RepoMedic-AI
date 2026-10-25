from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class DebugExample(BaseModel):
    id: str
    title: str
    category: str
    description: str
    code_filename: str
    test_filename: str
    buggy_code: str
    test_code: str
    expected_error: str
    faulty_function: str
    faulty_line: int
    fixed_code: str
    root_cause_summary: str

class AnalyzeRequest(BaseModel):
    example_id: Optional[str] = None
    code: Optional[str] = None
    test_code: Optional[str] = None
    error_log: Optional[str] = None

class RootCauseAnalysis(BaseModel):
    example_id: Optional[str] = None
    status: str = "success"
    faulty_function: str
    faulty_line: int
    root_cause: str
    expected_behavior: str
    actual_behavior: str
    suggested_fix: str
    diff: str
    explanation: str
    confidence_score: float = Field(default=0.98, ge=0.0, le=1.0)
    analysis_source: str = "deterministic_agent_engine"
    tags: List[str] = []

class VerifyRequest(BaseModel):
    example_id: str
    mode: str = "fixed" # "buggy" or "fixed"

class TimelineEvent(BaseModel):
    stage: str # "inspect", "diagnose", "propose", "verify"
    label: str
    status: str # "pending", "running", "done", "failed"
    timestamp: str
    details: Optional[str] = None

class TestResult(BaseModel):
    example_id: str
    mode: str
    success: bool
    exit_code: int
    passed_count: int
    failed_count: int
    total_count: int
    stdout: str
    stderr: str
    duration_ms: float
    test_runner: str = "pytest"
    timeline_events: List[TimelineEvent] = []
    summary: str
