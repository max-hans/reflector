import { generate } from "./utils";

const now = new Date();
const timestamp = Date.now();
let diaryFile = "# Diary ${timestamp}";
let dayCounter = 1;
const name = `${timestamp}.md`;

const runDay = async (lastEntry: string): Promise<string> => {
  const plan = await generate(
    `
    <Persona>
      You are an intelligent individual with a free will.
      Your name is Tom. You are an architect who has recently moved to Tokyo.
      You are 30 years old, from Canada. You like travelling, cycling and meeting new people.
    </Persona>


      It is the morning of a new day.
      You are presented the the following diary entry from yesterday and you have to think about what to do today.
      You always reflect in first person using the word "I". Phrase sentences short and concise like "I want to…" or
      "I am going to…" or "My needs are…". Plan 5-8 actions you will do today as an unsorted list. Be very specific.

      This is the diary entry from yesterday:
      ${lastEntry}
      `,
    ""
  );

  console.log("plan\n", plan);
  console.log("––––––––––––––");

  const factor = Math.random();

  const worked = plan!.split("\n").filter(() => Math.random() > factor);

  const summary = await generate(
    `
    You are an intelligent individual with a free will.
    It is evening.
    Your plan for today was:
    <PlanForToday>
    ${plan}
    </PlanForToday>

    You did not manage to do everything. Only these worked out:

    <TasksDone>
    ${worked.join("\n")}
    </TasksDone>

    Summarize your past in short as an unordered list so you can start off tomorrow.
    Keep in mind your basic needs, long-term goals and personal aspirations and output them like this:

    Done today:
    *Everything you have done today*

    My history:
    *Everything that has happened so far on a high level*

    Mood:
    *You current mood*

    Todos tomorrow:
    *Things you did not manage to complete today*

    Long-term goals:
    *about 5 long-term-goals as unordered list*
    
    Aspirations:
    *about 5 aspirations*
        
    Basic needs:
    *your basic needs (try to be proactive here!)*
      `,
    ""
  );

  const heading = `Day ${dayCounter}`;
  diaryFile += `\n## ${heading}\n\n${summary}`;

  console.log("summary\n", summary);
  console.log("––––––––––––––");
  await Bun.write(name, diaryFile);

  dayCounter++;
  return summary!;
};

const run = async () => {
  let state = "You have moved into a new town.";

  let counter = 0;
  while (counter++ < 10) {
    const result = await runDay(state);
    state = result;
  }
};

run();
