import difflib
from typing import Dict
from models import DebugExample

EXAMPLES: Dict[str, DebugExample] = {
    "off_by_one_paginator": DebugExample(
        id="off_by_one_paginator",
        title="Off-by-One in API Paginator",
        category="Logic Error",
        description="The pagination slice computes page offset using 0-based indexing without subtracting 1 for 1-indexed page queries, causing the first page to return page 2 items and partial pages to fail.",
        code_filename="paginator.py",
        test_filename="test_paginator.py",
        buggy_code="""def paginate_items(items, page=1, page_size=10):
    \"\"\"
    Return a slice of items for the requested 1-indexed page.
    \"\"\"
    if page < 1 or page_size < 1:
        raise ValueError("page and page_size must be >= 1")
    
    # BUG: Missing '- 1' offset for 1-based page numbers
    start_index = page * page_size
    end_index = start_index + page_size
    return items[start_index:end_index]
""",
        test_code="""import pytest
from paginator import paginate_items

def test_first_page_items():
    dataset = ["item_1", "item_2", "item_3", "item_4", "item_5"]
    page_1 = paginate_items(dataset, page=1, page_size=2)
    assert page_1 == ["item_1", "item_2"], f"Expected first 2 items, got {page_1}"

def test_second_page_items():
    dataset = ["item_1", "item_2", "item_3", "item_4", "item_5"]
    page_2 = paginate_items(dataset, page=2, page_size=2)
    assert page_2 == ["item_3", "item_4"], f"Expected next 2 items, got {page_2}"

def test_partial_tail_page():
    dataset = ["item_1", "item_2", "item_3", "item_4", "item_5"]
    page_3 = paginate_items(dataset, page=3, page_size=2)
    assert page_3 == ["item_5"], f"Expected partial tail item, got {page_3}"
""",
        expected_error="AssertionError: Expected first 2 items, got ['item_3', 'item_4']\nassert ['item_3', 'item_4'] == ['item_1', 'item_2']",
        faulty_function="paginate_items",
        faulty_line=9,
        fixed_code="""def paginate_items(items, page=1, page_size=10):
    \"\"\"
    Return a slice of items for the requested 1-indexed page.
    \"\"\"
    if page < 1 or page_size < 1:
        raise ValueError("page and page_size must be >= 1")
    
    # FIXED: Convert 1-indexed page number into 0-indexed slice start
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return items[start_index:end_index]
""",
        root_cause_summary="1-indexed page offset calculation omitted '(page - 1)'. For page=1 with size=2, start_index was evaluated as 1 * 2 = 2 (skipping item_1 and item_2)."
    ),

    "empty_list_indexing": DebugExample(
        id="empty_list_indexing",
        title="Unchecked List Indexing in Telemetry Pipeline",
        category="IndexError",
        description="The telemetry service accesses the tail element of a deployment log list without verifying whether the event queue is empty, resulting in an unhandled IndexError during cold-start or idle clusters.",
        code_filename="telemetry.py",
        test_filename="test_telemetry.py",
        buggy_code="""def get_latest_deployment_summary(deployments):
    \"\"\"
    Extracts high-level summary of the most recent deployment event.
    Returns status, deploy_id, and cluster.
    If no deployments exist, should return status 'IDLE' and deploy_id None.
    \"\"\"
    # BUG: Direct indexing [-1] without empty list guard
    latest_event = deployments[-1]
    
    return {
        "status": latest_event.get("status", "UNKNOWN"),
        "deploy_id": latest_event.get("id"),
        "cluster": latest_event.get("cluster", "us-east-1")
    }
""",
        test_code="""import pytest
from telemetry import get_latest_deployment_summary

def test_active_deployment_success():
    stream = [
        {"id": "dep-001", "status": "FAILED", "cluster": "us-east-1"},
        {"id": "dep-002", "status": "DEPLOYED", "cluster": "us-east-1"}
    ]
    summary = get_latest_deployment_summary(stream)
    assert summary["deploy_id"] == "dep-002"
    assert summary["status"] == "DEPLOYED"

def test_empty_deployment_stream():
    # BUG TRIGGER: Expects safe fallback when no deployments have run
    summary = get_latest_deployment_summary([])
    assert summary["status"] == "IDLE"
    assert summary["deploy_id"] is None
""",
        expected_error="IndexError: list index out of range\n  at telemetry.py:8: latest_event = deployments[-1]",
        faulty_function="get_latest_deployment_summary",
        faulty_line=8,
        fixed_code="""def get_latest_deployment_summary(deployments):
    \"\"\"
    Extracts high-level summary of the most recent deployment event.
    Returns status, deploy_id, and cluster.
    If no deployments exist, should return status 'IDLE' and deploy_id None.
    \"\"\"
    # FIXED: Guard against empty lists and provide safe default contract
    if not deployments:
        return {
            "status": "IDLE",
            "deploy_id": None,
            "cluster": "none"
        }
    
    latest_event = deployments[-1]
    
    return {
        "status": latest_event.get("status", "UNKNOWN"),
        "deploy_id": latest_event.get("id"),
        "cluster": latest_event.get("cluster", "us-east-1")
    }
""",
        root_cause_summary="`deployments[-1]` triggers `IndexError: list index out of range` whenever the list is empty. An early guard `if not deployments:` with default response prevents the crash."
    ),

    "zero_division_sla": DebugExample(
        id="zero_division_sla",
        title="ZeroDivisionError in SLA Uptime Monitor",
        category="Arithmetic Error",
        description="The SLA calculation engine computes the uptime percentage by dividing successful ping checks by total checks. Newly provisioned endpoints with 0 recorded checks throw a fatal ZeroDivisionError.",
        code_filename="sla_monitor.py",
        test_filename="test_sla_monitor.py",
        buggy_code="""def compute_uptime_percentage(successful_pings, total_pings):
    \"\"\"
    Calculates uptime percentage as float (0.0 to 100.0).
    When zero pings have been evaluated, uptime should be reported as 100.0%.
    \"\"\"
    # BUG: No divisor check for total_pings == 0
    raw_ratio = successful_pings / total_pings
    return round(raw_ratio * 100.0, 2)
""",
        test_code="""import pytest
from sla_monitor import compute_uptime_percentage

def test_healthy_cluster_sla():
    uptime = compute_uptime_percentage(990, 1000)
    assert uptime == 99.0

def test_imperfect_cluster_sla():
    uptime = compute_uptime_percentage(95, 100)
    assert uptime == 95.0

def test_newly_provisioned_cluster_zero_pings():
    # BUG TRIGGER: 0 total checks recorded
    uptime = compute_uptime_percentage(0, 0)
    assert uptime == 100.0
""",
        expected_error="ZeroDivisionError: division by zero\n  at sla_monitor.py:7: raw_ratio = successful_pings / total_pings",
        faulty_function="compute_uptime_percentage",
        faulty_line=7,
        fixed_code="""def compute_uptime_percentage(successful_pings, total_pings):
    \"\"\"
    Calculates uptime percentage as float (0.0 to 100.0).
    When zero pings have been evaluated, uptime should be reported as 100.0%.
    \"\"\"
    # FIXED: Handle edge-case where no checks exist yet
    if total_pings <= 0:
        return 100.0
    
    raw_ratio = successful_pings / total_pings
    return round(raw_ratio * 100.0, 2)
""",
        root_cause_summary="`successful_pings / total_pings` raises `ZeroDivisionError` when `total_pings == 0`. Adding an early guard `if total_pings <= 0: return 100.0` resolves the edge case."
    ),

    "mutable_default_audit": DebugExample(
        id="mutable_default_audit",
        title="Mutable Default Argument Leak in Audit Trail",
        category="State Leak",
        description="A default mutable list argument `tags=[]` in the security audit logger retains modified state across sequential function invocations, corrupting audit trails with unrelated tenant tags.",
        code_filename="audit_logger.py",
        test_filename="test_audit_logger.py",
        buggy_code="""def create_audit_record(action_name, user_id, initial_tags=[]):
    \"\"\"
    Generate an audit log entry with metadata tags.
    \"\"\"
    # BUG: Mutable default argument persists state across calls
    initial_tags.append(f"act:{action_name}")
    return {
        "user_id": user_id,
        "action": action_name,
        "tags": initial_tags
    }
""",
        test_code="""import pytest
from audit_logger import create_audit_record

def test_first_audit_call():
    rec1 = create_audit_record("LOGIN", "user-1")
    assert rec1["tags"] == ["act:LOGIN"]

def test_second_audit_call_isolation():
    # BUG TRIGGER: Without isolated default, initial_tags will contain previous tags!
    rec2 = create_audit_record("EXPORT_DATA", "user-2")
    assert rec2["tags"] == ["act:EXPORT_DATA"], f"Tags leaked: {rec2['tags']}"
""",
        expected_error="AssertionError: Tags leaked: ['act:LOGIN', 'act:EXPORT_DATA']\nassert ['act:LOGIN', 'act:EXPORT_DATA'] == ['act:EXPORT_DATA']",
        faulty_function="create_audit_record",
        faulty_line=1,
        fixed_code="""def create_audit_record(action_name, user_id, initial_tags=None):
    \"\"\"
    Generate an audit log entry with metadata tags.
    \"\"\"
    # FIXED: Use None as default and instantiate fresh list per invocation
    if initial_tags is None:
        current_tags = []
    else:
        current_tags = list(initial_tags)
        
    current_tags.append(f"act:{action_name}")
    return {
        "user_id": user_id,
        "action": action_name,
        "tags": current_tags
    }
""",
        root_cause_summary="Python binds default parameter expressions at function definition time. Using `initial_tags=[]` causes all calls that omit the argument to mutate the same list object."
    )
}

def generate_unified_diff(old_code: str, new_code: str, filename: str = "solution.py") -> str:
    """Generates standard unified diff format for before/after comparison."""
    old_lines = old_code.splitlines(keepends=True)
    new_lines = new_code.splitlines(keepends=True)
    diff = difflib.unified_diff(
        old_lines,
        new_lines,
        fromfile=f"a/{filename} (buggy)",
        tofile=f"b/{filename} (fixed)",
        lineterm=""
    )
    return "\n".join(diff)
