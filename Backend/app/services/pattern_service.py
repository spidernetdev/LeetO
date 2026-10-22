from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


from app.models.pattern import Pattern, SubmissionPattern


async def save_patterns(
    db: AsyncSession,
    submission,
    patterns: list
):

    for pattern_data in patterns:

        if not isinstance(pattern_data, dict):
            continue

        main_pattern = pattern_data.get(
            "main_pattern"
        )

        subpattern = pattern_data.get(
            "subpattern"
        )

        confidence = pattern_data.get(
            "confidence"
        )

        reason = pattern_data.get(
            "reason"
        )

        if not main_pattern:
            continue

        # Find main pattern
        result = await db.execute(
            select(Pattern).where(
                Pattern.name == main_pattern
            )
        )

        main_pattern_obj = (
            result.scalar_one_or_none()
        )

        # Create main pattern
        if main_pattern_obj is None:

            main_pattern_obj = Pattern(
                name=main_pattern,
                description=None,
                parent_id=None,
            )

            db.add(main_pattern_obj)

            await db.flush()

        # Main pattern must have no parent
        elif main_pattern_obj.parent_id is not None:

            main_pattern_obj.parent_id = None

            await db.flush()

        pattern_to_attach = main_pattern_obj

        # Subpattern
        if subpattern and subpattern != main_pattern:

            result = await db.execute(
                select(Pattern).where(
                    Pattern.name == subpattern
                )
            )

            subpattern_obj = (
                result.scalar_one_or_none()
            )

            if subpattern_obj is None:

                subpattern_obj = Pattern(
                    name=subpattern,
                    description=None,
                    parent_id=main_pattern_obj.id,
                )

                db.add(subpattern_obj)

                await db.flush()

            else:

                if (
                    subpattern_obj.parent_id
                    != main_pattern_obj.id
                ):

                    subpattern_obj.parent_id = (
                        main_pattern_obj.id
                    )

                    await db.flush()

            pattern_to_attach = subpattern_obj

        # Submission ↔ Pattern
        result = await db.execute(
            select(SubmissionPattern).where(
                SubmissionPattern.submission_id
                == submission.id,

                SubmissionPattern.pattern_id
                == pattern_to_attach.id,
            )
        )

        submission_pattern = (
            result.scalar_one_or_none()
        )

        if submission_pattern is None:

            submission_pattern = SubmissionPattern(
                submission_id=submission.id,
                pattern_id=pattern_to_attach.id,
                confidence=confidence,
                reason=reason,
            )

            db.add(submission_pattern)

        else:

            submission_pattern.confidence = confidence
            submission_pattern.reason = reason