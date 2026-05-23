# LinguaQuest Vision Agent

This service runs the LinguaQuest AI language teacher with:

- `vision-agents` for the real-time agent runtime
- `getstream.Edge()` for transport
- `openai.Realtime()` for the voice LLM

The agent always teaches through English. It can still give short examples in the learner's selected language.

## Environment

The service loads the parent repo `.env` file automatically, so it reuses:

- `STREAM_API_KEY`
- `STREAM_API_SECRET`

Add this key to the same parent `.env` file before starting the service:

- `OPENAI_API_KEY`

Optional service settings:

- `VISION_AGENT_OPENAI_MODEL` defaults to `gpt-realtime-2`
- `VISION_AGENT_OPENAI_VOICE` defaults to `marin`
- `VISION_AGENT_CALL_TYPE` defaults to `audio_room`
- `VISION_AGENT_MAX_CONCURRENT_SESSIONS` defaults to `10`
- `VISION_AGENT_MAX_SESSION_DURATION_SECONDS` defaults to `1800`
- `VISION_AGENT_PARTICIPANT_WAIT_TIMEOUT_SECONDS` defaults to `30`

## Run

From the repo root:

```bash
cd vision-agent
uv sync
uv run agent.py serve --host 0.0.0.0 --port 8000
```

Local single-session mode:

```bash
cd vision-agent
uv run agent.py run --call-type audio_room --call-id demo-call
```

## Session metadata

The Expo API routes now write the lesson context directly into the Stream call's custom data.
On join, the agent fetches that call data and uses it to tailor the lesson.

Current fields consumed from the Stream call:

- `languageCode`
- `languageName`
- `lessonDescription`
- `lessonGoals`
- `lessonId`
- `lessonPhrases`
- `lessonTitle`
- `lessonVocabulary`
- `teacherName`
- `teacherPrompt`
