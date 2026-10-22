from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.models.pattern import Pattern, SubmissionPattern
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.topic import ProblemTopic, Topic


# A problem counts as "solved" when the user has at least one submission
# with this status. Change it here if you want a different definition.
SOLVED_STATUS = "accepted"


def _is_solved():
    return func.lower(Submission.status) == SOLVED_STATUS


async def _pattern_counts(db: AsyncSession, user_id) -> list[tuple[str, int]]:
    """Main-pattern name -> number of distinct SOLVED problems using it.

    Subpatterns are rolled up into their main pattern.
    """
    p = aliased(Pattern)
    parent = aliased(Pattern)
    name = func.coalesce(parent.name, p.name)

    rows = await db.execute(
        select(name, func.count(func.distinct(Submission.problem_id)))
        .select_from(Submission)
        .join(SubmissionPattern, SubmissionPattern.submission_id == Submission.id)
        .join(p, p.id == SubmissionPattern.pattern_id)
        .outerjoin(parent, parent.id == p.parent_id)
        .where(Submission.user_id == user_id, _is_solved())
        .group_by(name)
        .order_by(func.count(func.distinct(Submission.problem_id)).desc(), name)
    )
    return [(n, c) for n, c in rows]


# ============================================================
# 3.3  DASHBOARD
# ============================================================

async def get_dashboard_stats(db: AsyncSession, user_id) -> dict:

    total_submissions = (
        await db.execute(
            select(func.count(Submission.id)).where(Submission.user_id == user_id)
        )
    ).scalar_one()

    total_solved = (
        await db.execute(
            select(func.count(func.distinct(Submission.problem_id))).where(
                Submission.user_id == user_id, _is_solved()
            )
        )
    ).scalar_one()

    difficulty_rows = await db.execute(
        select(Problem.difficulty, func.count(func.distinct(Problem.id)))
        .select_from(Submission)
        .join(Problem, Problem.id == Submission.problem_id)
        .where(Submission.user_id == user_id, _is_solved())
        .group_by(Problem.difficulty)
    )

    difficulty_breakdown = {"Easy": 0, "Medium": 0, "Hard": 0}
    for difficulty, count in difficulty_rows:
        if difficulty:
            difficulty_breakdown[difficulty.strip().title()] = count

    pattern_counts = dict(await _pattern_counts(db, user_id))

    return {
        "total_problems_solved": total_solved,
        "total_submissions": total_submissions,
        "difficulty_breakdown": difficulty_breakdown,
        "pattern_counts": pattern_counts,
    }


# ============================================================
# 3.4  ANALYTICS
# ============================================================

async def get_analytics(db: AsyncSession, user_id) -> dict:

    # Patterns: same numbers as the dashboard.
    patterns = [
        {"name": name, "count": count}
        for name, count in await _pattern_counts(db, user_id)
    ]

    # Topics: number of distinct SOLVED problems carrying each topic.
    topic_rows = await db.execute(
        select(Topic.name, func.count(func.distinct(Submission.problem_id)))
        .select_from(Submission)
        .join(ProblemTopic, ProblemTopic.problem_id == Submission.problem_id)
        .join(Topic, Topic.id == ProblemTopic.topic_id)
        .where(Submission.user_id == user_id, _is_solved())
        .group_by(Topic.name)
        .order_by(func.count(func.distinct(Submission.problem_id)).desc(), Topic.name)
    )
    topics = [{"name": name, "count": count} for name, count in topic_rows]

    # Languages: number of ALL submissions per language
    # (so the counts add up to total_submissions).
    language_rows = await db.execute(
        select(Submission.language, func.count(Submission.id))
        .where(Submission.user_id == user_id, Submission.language.is_not(None))
        .group_by(Submission.language)
        .order_by(func.count(Submission.id).desc(), Submission.language)
    )
    languages = [{"name": name, "count": count} for name, count in language_rows]

    return {
        "patterns": patterns,
        "topics": topics,
        "languages": languages,
    }