from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.problem import Problem
from app.models.topic import Topic


async def find_or_create_problem(
    db: AsyncSession,
    problem_data
):

    result = await db.execute(
        select(Problem)
        .options(
            selectinload(Problem.topics)
        )
        .where(
            Problem.slug == problem_data.slug
        )
    )

    problem = result.scalar_one_or_none()

    if problem is None:

        problem = Problem(
            slug=problem_data.slug,
            url=problem_data.url,
            title=problem_data.title,
            difficulty=problem_data.difficulty,
            description=problem_data.description,
        )

        problem.topics = []

        db.add(problem)

        await db.flush()

    return problem

async def attach_topics(
    db: AsyncSession,
    problem: Problem,
    topic_names: list[str]
):

    existing_topic_names = {
        topic.name
        for topic in problem.topics
    }

    for topic_name in topic_names:

        if topic_name in existing_topic_names:
            continue

        result = await db.execute(
            select(Topic).where(
                Topic.name == topic_name
            )
        )

        topic = result.scalar_one_or_none()

        if topic is None:

            topic = Topic(
                name=topic_name
            )

            db.add(topic)

            await db.flush()

        problem.topics.append(topic)

        existing_topic_names.add(topic_name)