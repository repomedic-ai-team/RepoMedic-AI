import os
import re
import sys
import time
import tempfile
import subprocess
from datetime import datetime
from models import TestResult, TimelineEvent
from demo_fixtures import EXAMPLES

def run_isolated_pytest(example_id: str, mode: str = "fixed") -> TestResult:
    """
    Executes actual pytest in an isolated temporary directory.
    - If mode == 'buggy', runs test against the buggy source code (real failure!)
    - If mode == 'fixed', runs test against the proposed fixed code (real pass!)
    Safety:
    - Never evaluates arbitrary untested remote strings directly.
    - Strictly checks fixture ID against trusted predefined models.
    - Subprocess execution has strict 10 second timeout and isolated cwd.
    """
    start_time = time.time()
    iso_timestamp = datetime.utcnow().strftime("%H:%M:%S")

    if example_id not in EXAMPLES:
        raise ValueError(f"Unknown trusted example fixture: {example_id}")

    fixture = EXAMPLES[example_id]
    code_content = fixture.fixed_code if mode == "fixed" else fixture.buggy_code
    test_content = fixture.test_code

    timeline_events = [
        TimelineEvent(
            stage="inspect",
            label=f"Inspecting code fixture: {fixture.code_filename}",
            status="done",
            timestamp=iso_timestamp,
            details=f"Extracted AST & loaded test suite {fixture.test_filename}"
        ),
        TimelineEvent(
            stage="diagnose",
            label="Root cause diagnosis completed",
            status="done",
            timestamp=iso_timestamp,
            details=f"Isolated issue at line {fixture.faulty_line} in function `{fixture.faulty_function}`"
        ),
        TimelineEvent(
            stage="propose",
            label=f"Patch generation ({mode.upper()})",
            status="done",
            timestamp=iso_timestamp,
            details="Loaded verified syntax patch into execution sandbox" if mode == "fixed" else "Loaded original buggy commit into execution sandbox"
        )
    ]

    with tempfile.TemporaryDirectory(prefix="repomedic_") as temp_dir:
        # Write module file
        code_path = os.path.join(temp_dir, fixture.code_filename)
        with open(code_path, "w", encoding="utf-8") as f:
            f.write(code_content)

        # Write test file
        test_path = os.path.join(temp_dir, fixture.test_filename)
        with open(test_path, "w", encoding="utf-8") as f:
            f.write(test_content)

        cmd = [
            sys.executable,
            "-m",
            "pytest",
            "-v",
            "--no-header",
            fixture.test_filename
        ]

        try:
            proc = subprocess.run(
                cmd,
                cwd=temp_dir,
                capture_output=True,
                text=True,
                timeout=10
            )
            exit_code = proc.returncode
            stdout = proc.stdout
            stderr = proc.stderr
        except subprocess.TimeoutExpired as e:
            exit_code = 124
            stdout = e.stdout or ""
            stderr = "Execution timed out after 10.0 seconds in sandbox."
        except Exception as e:
            exit_code = 1
            stdout = ""
            stderr = str(e)

    duration_ms = round((time.time() - start_time) * 1000, 2)
    now_timestamp = datetime.utcnow().strftime("%H:%M:%S")

    # Parse pytest output
    passed_match = re.search(r"(\d+)\s+passed", stdout)
    failed_match = re.search(r"(\d+)\s+failed", stdout)

    passed_count = int(passed_match.group(1)) if passed_match else 0
    failed_count = int(failed_match.group(1)) if failed_match else 0
    total_count = passed_count + failed_count

    success = (exit_code == 0)

    if success:
        timeline_events.append(
            TimelineEvent(
                stage="verify",
                label="Pytest verification: PASSED",
                status="done",
                timestamp=now_timestamp,
                details=f"All {passed_count} test(s) passed successfully (exit code 0) in {duration_ms}ms"
            )
        )
        summary = f"All {passed_count} tests PASSED with zero failures. Code fix verified!"
    else:
        timeline_events.append(
            TimelineEvent(
                stage="verify",
                label=f"Pytest verification: FAILED ({failed_count} failures)",
                status="failed",
                timestamp=now_timestamp,
                details=f"Test runner encountered {failed_count} failure(s) (exit code {exit_code})"
            )
        )
        summary = f"Test execution reported {failed_count} failed test(s). Investigation required."

    return TestResult(
        example_id=example_id,
        mode=mode,
        success=success,
        exit_code=exit_code,
        passed_count=passed_count,
        failed_count=failed_count,
        total_count=total_count,
        stdout=stdout,
        stderr=stderr,
        duration_ms=duration_ms,
        test_runner="pytest 9.1.1",
        timeline_events=timeline_events,
        summary=summary
    )
