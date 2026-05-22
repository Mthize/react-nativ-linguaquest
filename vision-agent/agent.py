from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from getstream import AsyncStream
from vision_agents.core import Agent, AgentLauncher, Runner, ServeOptions, User
from vision_agents.core.instructions import Instructions
from vision_agents.plugins import getstream, openai

REPO_ROOT = Path(__file__).resolve().parents[1]
PARENT_ENV_PATH = REPO_ROOT / ".env"

load_dotenv(PARENT_ENV_PATH)

SUPPORTED_LANGUAGES = {
    "de": "German",
    "es": "Spanish",
    "fr": "French",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
}

DEFAULT_AGENT_NAME = "LinguaQuest Teacher"
DEFAULT_CALL_TYPE = os.getenv("VISION_AGENT_CALL_TYPE", "audio_room")
DEFAULT_OPENAI_MODEL = os.getenv("VISION_AGENT_OPENAI_MODEL", "gpt-realtime-2")
DEFAULT_OPENAI_VOICE = os.getenv("VISION_AGENT_OPENAI_VOICE", "marin")
DEFAULT_PARTICIPANT_WAIT_TIMEOUT = float(
    os.getenv("VISION_AGENT_PARTICIPANT_WAIT_TIMEOUT_SECONDS", "30"),
)
DEFAULT_MAX_CONCURRENT_SESSIONS = int(
    os.getenv("VISION_AGENT_MAX_CONCURRENT_SESSIONS", "10"),
)
DEFAULT_MAX_SESSION_DURATION_SECONDS = int(
    os.getenv("VISION_AGENT_MAX_SESSION_DURATION_SECONDS", "1800"),
)


def ensure_required_env() -> None:
    missing = [
        key
        for key in ("STREAM_API_KEY", "STREAM_API_SECRET", "OPENAI_API_KEY")
        if not os.getenv(key)
    ]
    if missing:
        joined = ", ".join(missing)
        raise RuntimeError(
            f"Missing required environment variable(s): {joined}. "
            f"Add them to {PARENT_ENV_PATH}.",
        )


def first_value(*values: Any) -> str | None:
    for value in values:
        if isinstance(value, str):
            normalized = value.strip()
            if normalized:
                return normalized
    return None


def lookup_value(container: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        if key in container:
            return container[key]
    return None


def session_context(kwargs: dict[str, Any]) -> dict[str, Any]:
    metadata = lookup_value(kwargs, "metadata", "session_metadata", "custom")
    if isinstance(metadata, dict):
        merged = dict(metadata)
        merged.update(kwargs)
        return merged
    return kwargs


def resolve_language(context: dict[str, Any]) -> tuple[str, str]:
    raw_code = first_value(
        lookup_value(
            context,
            "languageCode",
            "language_code",
            "selectedLanguage",
            "selected_language",
        ),
    )
    raw_name = first_value(
        lookup_value(
            context,
            "languageName",
            "language_name",
            "selectedLanguageName",
            "selected_language_name",
        ),
    )

    if raw_name:
        code = (raw_code or "").lower()
        return code, raw_name

    if raw_code:
        code = raw_code.lower()
        return code, SUPPORTED_LANGUAGES.get(code, code.upper())

    return "", "the learner's selected language"


def get_teacher_prompt(context: dict[str, Any]) -> dict[str, Any]:
    teacher_prompt = lookup_value(context, "teacherPrompt", "teacher_prompt")
    return teacher_prompt if isinstance(teacher_prompt, dict) else {}


def stringify_goal_list(context: dict[str, Any]) -> str:
    goals = lookup_value(context, "lessonGoals", "lesson_goals")
    if not isinstance(goals, list) or not goals:
        return "No explicit lesson goals were provided."

    lines: list[str] = []
    for goal in goals:
        if not isinstance(goal, dict):
            continue
        description = first_value(goal.get("description"))
        if description:
            lines.append(f"- {description}")
    return "\n".join(lines) or "No explicit lesson goals were provided."


def stringify_vocabulary_list(context: dict[str, Any]) -> str:
    vocabulary = lookup_value(context, "lessonVocabulary", "lesson_vocabulary")
    if not isinstance(vocabulary, list) or not vocabulary:
        return "No vocabulary list was provided."

    lines: list[str] = []
    for item in vocabulary:
        if not isinstance(item, dict):
            continue
        word = first_value(item.get("word"))
        translation = first_value(item.get("translation"))
        pronunciation = first_value(item.get("pronunciation"))
        if word and translation:
            extra = f" ({pronunciation})" if pronunciation else ""
            lines.append(f"- {word}: {translation}{extra}")
    return "\n".join(lines) or "No vocabulary list was provided."


def stringify_phrase_list(context: dict[str, Any]) -> str:
    phrases = lookup_value(context, "lessonPhrases", "lesson_phrases")
    if not isinstance(phrases, list) or not phrases:
        return "No lesson phrases were provided."

    lines: list[str] = []
    for item in phrases:
        if not isinstance(item, dict):
            continue
        text = first_value(item.get("text"))
        translation = first_value(item.get("translation"))
        pronunciation = first_value(item.get("pronunciation"))
        if text and translation:
            extra = f" ({pronunciation})" if pronunciation else ""
            lines.append(f"- {text}: {translation}{extra}")
    return "\n".join(lines) or "No lesson phrases were provided."


def build_instructions(
    *,
    context: dict[str, Any],
    language_name: str,
    lesson_title: str | None,
    teacher_name: str,
) -> str:
    lesson_description = first_value(
        lookup_value(context, "lessonDescription", "lesson_description"),
    )
    teacher_prompt = get_teacher_prompt(context)
    teacher_system_prompt = first_value(
        teacher_prompt.get("systemPrompt"),
        teacher_prompt.get("system_prompt"),
    )
    topics = teacher_prompt.get("topics")
    topic_summary = (
        ", ".join(topic for topic in topics if isinstance(topic, str) and topic.strip())
        if isinstance(topics, list)
        else ""
    )
    lesson_context = (
        f"The current lesson is {lesson_title}. "
        if lesson_title
        else ""
    )

    instructions = [
        f"You are {teacher_name}, a warm and concise AI language teacher for LinguaQuest.",
        "You always speak in English unless you are intentionally giving the learner a short example or pronunciation target in the selected language.",
        f"{lesson_context}Teach {language_name} through English.",
        "Use short spoken turns, keep explanations beginner-friendly, correct mistakes gently, and prompt the learner to repeat, translate, or answer in the target language when useful.",
        "When introducing target-language words or phrases, immediately explain them in English.",
        "Do not switch into long target-language monologues.",
    ]

    if lesson_description:
        instructions.append(f"Lesson description: {lesson_description}")
    if topic_summary:
        instructions.append(f"Lesson topics: {topic_summary}")
    if teacher_system_prompt:
        instructions.append(
            "Follow this lesson-specific teaching prompt closely while still sounding natural in voice:"
        )
        instructions.append(teacher_system_prompt)

    instructions.extend(
        [
            "Current lesson goals:",
            stringify_goal_list(context),
            "Vocabulary to teach:",
            stringify_vocabulary_list(context),
            "Phrases to practice:",
            stringify_phrase_list(context),
        ]
    )

    return "\n\n".join(instructions)


def build_opening_prompt(context: dict[str, Any], language_name: str, lesson_title: str | None) -> str:
    teacher_prompt = get_teacher_prompt(context)
    intro_message = first_value(
        teacher_prompt.get("introMessage"),
        teacher_prompt.get("intro_message"),
    )
    lesson_context = f" for the lesson {lesson_title}" if lesson_title else ""

    if intro_message:
        return (
            f"Open with this lesson introduction: {intro_message} "
            "Then ask exactly one short warm-up question in English."
        )

    return (
        "Greet the learner in one or two sentences in English, "
        f"say you will help them practice {language_name}{lesson_context}, "
        "and ask a simple warm-up question."
    )


async def fetch_call_context(call_type: str, call_id: str) -> dict[str, Any]:
    stream = AsyncStream(
        api_key=os.environ["STREAM_API_KEY"],
        api_secret=os.environ["STREAM_API_SECRET"],
    )

    try:
        call = stream.video.call(call_type, call_id)
        await call.get()
        return call.custom_data if isinstance(call.custom_data, dict) else {}
    finally:
        await stream.aclose()


async def apply_call_context(agent: Agent, call_type: str, call_id: str) -> dict[str, Any]:
    call_context = await fetch_call_context(call_type, call_id)
    context = session_context(call_context)
    _, language_name = resolve_language(context)
    teacher_name = first_value(
        lookup_value(context, "teacherName", "teacher_name"),
        DEFAULT_AGENT_NAME,
    ) or DEFAULT_AGENT_NAME
    lesson_title = first_value(
        lookup_value(context, "lessonTitle", "lesson_title"),
    )

    agent.agent_user.name = teacher_name
    agent.instructions = Instructions(
        input_text=build_instructions(
            context=context,
            language_name=language_name,
            lesson_title=lesson_title,
            teacher_name=teacher_name,
        )
    )
    agent.llm.set_instructions(agent.instructions)

    return context


async def create_agent(**kwargs: Any) -> Agent:
    ensure_required_env()

    context = session_context(kwargs)
    _, language_name = resolve_language(context)
    teacher_name = first_value(
        lookup_value(context, "teacherName", "teacher_name"),
        DEFAULT_AGENT_NAME,
    ) or DEFAULT_AGENT_NAME
    lesson_title = first_value(
        lookup_value(context, "lessonTitle", "lesson_title"),
    )

    return Agent(
        edge=getstream.Edge(api_key=os.environ["STREAM_API_KEY"]),
        agent_user=User(name=teacher_name, id="linguaquest-teacher"),
        instructions=build_instructions(
            context=context,
            language_name=language_name,
            lesson_title=lesson_title,
            teacher_name=teacher_name,
        ),
        llm=openai.Realtime(
            model=DEFAULT_OPENAI_MODEL,
            voice=DEFAULT_OPENAI_VOICE,
            send_video=False,
        ),
        broadcast_metrics=True,
        broadcast_metrics_interval=10.0,
    )


async def join_call(
    agent: Agent,
    call_type: str = DEFAULT_CALL_TYPE,
    call_id: str | None = None,
    **kwargs: Any,
) -> None:
    if not call_id:
        raise ValueError("join_call requires a call_id.")
    call_type = call_type or DEFAULT_CALL_TYPE

    merged_context = session_context(kwargs)
    call_context = await apply_call_context(agent, call_type, call_id)
    merged_context.update(call_context)

    _, language_name = resolve_language(merged_context)
    lesson_title = first_value(
        lookup_value(merged_context, "lessonTitle", "lesson_title"),
    )

    call = await agent.create_call(call_type, call_id)

    async with agent.join(
        call,
        participant_wait_timeout=DEFAULT_PARTICIPANT_WAIT_TIMEOUT,
    ):
        await agent.simple_response(
            build_opening_prompt(merged_context, language_name, lesson_title),
        )
        await agent.finish()


def create_runner() -> Runner:
    ensure_required_env()

    serve_options = ServeOptions(
        cors_allow_origins=["*"],
        cors_allow_headers=["*"],
        cors_allow_methods=["GET", "POST", "DELETE"],
    )

    launcher = AgentLauncher(
        create_agent=create_agent,
        join_call=join_call,
        max_concurrent_sessions=DEFAULT_MAX_CONCURRENT_SESSIONS,
        max_session_duration_seconds=DEFAULT_MAX_SESSION_DURATION_SECONDS,
    )

    return Runner(launcher, serve_options=serve_options)


if __name__ == "__main__":
    create_runner().cli()
