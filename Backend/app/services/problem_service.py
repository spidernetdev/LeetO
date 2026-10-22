from datetime import datetime, timezone

from sqlalchemy import case, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased, selectinload

from app.models.pattern import Pattern, SubmissionPattern
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.topic import ProblemTopic, Topic


# When the user submitted: fall back to created_at for older rows
# that never had submitted_at filled in.
SUBMITTED_AT = func.coalesce(Submission.submitted_at, Submission.created_at)

DIFFICULTY_ORDER = case(
    (func.lower(Problem.difficulty) == "easy", 1),
    (func.lower(Problem.difficulty) == "medium", 2),
    (func.lower(Problem.difficulty) == "hard", 3),
    else_=4,
)


def iso(dt: datetime | None) -> str | None:
    """Datetime -> '2026-10-09T08:30:00Z'."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


# ============================================================
# 3.1  LIST PROBLEMS
# ============================================================

async def list_problems(
    db: AsyncSession,
    user_id,
    search: str | None,
    difficulty: str | None,
    pattern: str | None,
    topic: str | None,
    sort: str,
    page: int,
    page_size: int,
) -> dict:

    # One row per problem THIS user has submitted, with counts.
    stats = (
        select(
            Submission.problem_id.label("problem_id"),
            func.count(Submission.id).label("submission_count"),
            func.max(SUBMITTED_AT).label("latest"),
        )
        .where(Submission.user_id == user_id)
        .group_by(Submission.problem_id)
        .subquery()
    )

    # ---------------- filters ----------------
    filters = []

    if difficulty:
        filters.append(func.lower(Problem.difficulty) == difficulty.lower())

    if search:
        topic_match = (
            select(ProblemTopic.problem_id)
            .join(Topic, Topic.id == ProblemTopic.topic_id)
            .where(
                ProblemTopic.problem_id == Problem.id,
                Topic.name.icontains(search, autoescape=True),
            )
            .exists()
        )
        filters.append(
            or_(
                Problem.title.icontains(search, autoescape=True),
                Problem.slug.icontains(search, autoescape=True),
                topic_match,
            )
        )

    if topic:
        topic_filter = (
            select(ProblemTopic.problem_id)
            .join(Topic, Topic.id == ProblemTopic.topic_id)
            .where(
                ProblemTopic.problem_id == Problem.id,
                func.lower(Topic.name) == topic.lower(),
            )
            .exists()
        )
        filters.append(topic_filter)

    if pattern:
        p = aliased(Pattern)
        parent = aliased(Pattern)
        pattern_filter = (
            select(Submission.id)
            .join(SubmissionPattern, SubmissionPattern.submission_id == Submission.id)
            .join(p, p.id == SubmissionPattern.pattern_id)
            .outerjoin(parent, parent.id == p.parent_id)
            .where(
                Submission.user_id == user_id,
                Submission.problem_id == Problem.id,
                or_(
                    func.lower(p.name) == pattern.lower(),
                    func.lower(parent.name) == pattern.lower(),
                ),
            )
            .exists()
        )
        filters.append(pattern_filter)

    # ---------------- total ----------------
    total = (
        await db.execute(
            select(func.count())
            .select_from(Problem)
            .join(stats, stats.c.problem_id == Problem.id)
            .where(*filters)
        )
    ).scalar_one()

    # ---------------- sorting ----------------
    order_by = {
        "newest": [stats.c.latest.desc()],
        "oldest": [stats.c.latest.asc()],
        "difficulty": [DIFFICULTY_ORDER.asc(), func.lower(Problem.title).asc()],
        "alphabetical": [func.lower(Problem.title).asc()],
    }[sort]

    rows = (
        await db.execute(
            select(Problem, stats.c.submission_count, stats.c.latest)
            .join(stats, stats.c.problem_id == Problem.id)
            .where(*filters)
            .order_by(*order_by, Problem.id)
            .limit(page_size)
            .offset((page - 1) * page_size)
        )
    ).all()

    problem_ids = [row[0].id for row in rows]

    # ---------------- topics + patterns + languages for this page (3 queries) ----------------
    topics_by_problem: dict = {pid: [] for pid in problem_ids}
    patterns_by_problem: dict = {pid: set() for pid in problem_ids}
    languages_by_problem: dict = {pid: set() for pid in problem_ids}

    if problem_ids:
        topic_rows = await db.execute(
            select(ProblemTopic.problem_id, Topic.name)
            .join(Topic, Topic.id == ProblemTopic.topic_id)
            .where(ProblemTopic.problem_id.in_(problem_ids))
            .order_by(Topic.name)
        )
        for problem_id, name in topic_rows:
            topics_by_problem[problem_id].append(name)

        p = aliased(Pattern)
        parent = aliased(Pattern)
        pattern_rows = await db.execute(
            select(Submission.problem_id, func.coalesce(parent.name, p.name))
            .join(SubmissionPattern, SubmissionPattern.submission_id == Submission.id)
            .join(p, p.id == SubmissionPattern.pattern_id)
            .outerjoin(parent, parent.id == p.parent_id)
            .where(
                Submission.user_id == user_id,
                Submission.problem_id.in_(problem_ids),
            )
            .distinct()
        )
        for problem_id, name in pattern_rows:
            patterns_by_problem[problem_id].add(name)

        language_rows = await db.execute(
            select(Submission.problem_id, Submission.language)
            .where(
                Submission.user_id == user_id,
                Submission.problem_id.in_(problem_ids),
                Submission.language.is_not(None),
            )
            .distinct()
        )
        for problem_id, language in language_rows:
            if language:
                languages_by_problem[problem_id].add(language)

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "problems": [
            {
                "id": str(problem.id),
                "slug": problem.slug,
                "title": problem.title,
                "difficulty": problem.difficulty,
                "url": problem.url,
                "topics": topics_by_problem[problem.id],
                "distinct_patterns": sorted(patterns_by_problem[problem.id]),
                "languages": sorted(languages_by_problem[problem.id], key=str.lower),
                "submission_count": submission_count,
                "latest_submitted_at": iso(latest),
            }
            for problem, submission_count, latest in rows
        ],
    }


# ============================================================
# 3.2  PROBLEM DETAIL
# ============================================================

async def get_problem_detail(
    db: AsyncSession,
    user_id,
    slug: str,
) -> dict | None:
    """Returns None when the problem does not exist OR the user never submitted it."""

    lookup_cond = Problem.slug == slug
    try:
        import uuid as _uuid
        uuid_val = _uuid.UUID(slug)
        lookup_cond = or_(Problem.slug == slug, Problem.id == uuid_val)
    except (ValueError, AttributeError):
        pass

    problem = (
        await db.execute(select(Problem).where(lookup_cond))
    ).scalar_one_or_none()

    if problem is None:
        return None

    submissions = (
        (
            await db.execute(
                select(Submission)
                .options(selectinload(Submission.analysis))
                .where(
                    Submission.user_id == user_id,
                    Submission.problem_id == problem.id,
                )
                .order_by(SUBMITTED_AT.desc(), Submission.id)
            )
        )
        .scalars()
        .all()
    )

    if not submissions:
        return None

    topic_names = (
        await db.execute(
            select(Topic.name)
            .join(ProblemTopic, ProblemTopic.topic_id == Topic.id)
            .where(ProblemTopic.problem_id == problem.id)
            .order_by(Topic.name)
        )
    ).scalars().all()

    # ---- patterns of every submission, in one query ----
    p = aliased(Pattern)
    parent = aliased(Pattern)

    pattern_rows = await db.execute(
        select(
            SubmissionPattern.submission_id,
            p.name.label("pattern_name"),
            parent.name.label("parent_name"),
            SubmissionPattern.confidence,
            SubmissionPattern.reason,
        )
        .join(p, p.id == SubmissionPattern.pattern_id)
        .outerjoin(parent, parent.id == p.parent_id)
        .where(SubmissionPattern.submission_id.in_([s.id for s in submissions]))
        .order_by(SubmissionPattern.confidence.desc().nulls_last(), p.name)
    )

    patterns_by_submission: dict = {s.id: [] for s in submissions}
    distinct_patterns: set[str] = set()

    for submission_id, pattern_name, parent_name, confidence, reason in pattern_rows:
        # A saved pattern is either a main pattern (no parent) or a subpattern.
        if parent_name and parent_name != pattern_name:
            main_pattern, subpattern = parent_name, pattern_name
        else:
            main_pattern, subpattern = pattern_name, None

        distinct_patterns.add(main_pattern)
        patterns_by_submission[submission_id].append(
            {
                "main_pattern": main_pattern,
                "subpattern": subpattern,
                "confidence": confidence,
                "reason": reason,
            }
        )

    def analysis_json(submission: Submission) -> dict | None:
        analysis = submission.analysis
        if analysis is None:
            return None
        return {
            "patterns": patterns_by_submission[submission.id],
            "data_structures": analysis.data_structures or [],
            "algorithms": analysis.algorithms or [],
            "time_complexity": analysis.time_complexity,
            "space_complexity": analysis.space_complexity,
            "explanation": analysis.explanation,
        }

    return {
        "id": str(problem.id),
        "slug": problem.slug,
        "title": problem.title,
        "difficulty": problem.difficulty,
        "url": problem.url,
        "topics": list(topic_names),
        "distinct_patterns": sorted(distinct_patterns),
        "submission_count": len(submissions),
        "submissions": [
            {
                "id": str(s.id),
                "code": s.code,
                "language": s.language,
                "status": s.status,
                "submitted_at": iso(s.submitted_at or s.created_at),
                "analysis": analysis_json(s),
            }
            for s in submissions
        ],
    }