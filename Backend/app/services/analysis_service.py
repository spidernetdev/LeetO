from fastapi.concurrency import run_in_threadpool

from app.ai.llm_service import analyze_solution


async def analyze_submission(
    problem_description: str,
    code: str
):

    analysis = await run_in_threadpool(
        analyze_solution,
        problem_description=problem_description,
        code=code,
    )

    return analysis