from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.services.topic_service import find_or_create_problem
from app.services.topic_service import attach_topics
from app.services.analysis_service import analyze_submission
from app.services.pattern_service import save_patterns

from app.models.submission import Submission
from app.models.solution_analysis import SolutionAnalysis


async def process_submission(
    data,
    db: AsyncSession,
    user_id,
):

    # 1. Problem
    problem = await find_or_create_problem(
        db=db,
        problem_data=data.problem
    )

    # 2. Topics
    await attach_topics(
        db=db,
        problem=problem,
        topic_names=data.problem.topics
    )

    # 3. Submission
    submission = Submission(
        user_id=user_id,
        problem_id=problem.id,
        code=data.code,
        language=data.language,
        status=data.status,
        submitted_at=datetime.now(timezone.utc),
    )

    db.add(submission)

    await db.flush()

    # 4. AI analysis
    analysis = await analyze_submission(
        problem_description=data.problem.description,
        code=data.code
    )

    # 5. Patterns
    await save_patterns(
        db=db,
        submission=submission,
        patterns=analysis.get("patterns", [])
    )

    # 6. Analysis
    solution_analysis = SolutionAnalysis(
        submission_id=submission.id,
        data_structures=analysis.get(
            "data_structures", []
        ),
        algorithms=analysis.get(
            "algorithms", []
        ),
        time_complexity=analysis.get(
            "time_complexity"
        ),
        space_complexity=analysis.get(
            "space_complexity"
        ),
        explanation=analysis.get(
            "explanation"
        ),
    )

    db.add(solution_analysis)

    # 7. Commit
    await db.commit()

    await db.refresh(submission)

    return {
        "submission": submission,
        "analysis": analysis,
    }