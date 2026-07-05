export type TenseCategory = "present" | "past" | "future" | "past-future";

export interface PronounFormula {
  pronoun: string;
  positive: string;
  negative: string;
  interrogative: string;
  negativeInterrogative: string;
}

export interface Tense {
  slug: string;
  name: string;
  indonesian: string;
  category: TenseCategory;
  overview: string;
  formula: { positive: string; negative: string; interrogative: string; negativeInterrogative: string };
  positive: string[];
  negative: string[];
  interrogative: string[];
  negativeInterrogative: string[];
  examples: string[];
  timeExpressions: string[];
  usage: string[];
}

const T = (
  slug: string,
  name: string,
  indonesian: string,
  category: TenseCategory,
  overview: string,
  formula: Tense["formula"],
  positive: string[],
  negative: string[],
  interrogative: string[],
  negativeInterrogative: string[],
  examples: string[],
  timeExpressions: string[],
  usage: string[]
): Tense => ({
  slug, name, indonesian, category, overview, formula,
  positive, negative, interrogative, negativeInterrogative,
  examples, timeExpressions, usage,
});

export const TENSES: Tense[] = [
  // ---------- PRESENT ----------
  T(
    "simple-present", "Simple Present", "Present Tense", "present",
    "Used for habits, general truths, and routines — perfect for describing daily life around Tangerang.",
    {
      positive: "S + V1 (s/es) + O",
      negative: "S + do/does + not + V1 + O",
      interrogative: "Do/Does + S + V1 + O ?",
      negativeInterrogative: "Don't/Doesn't + S + V1 + O ?",
    },
    [
      "I walk along the Cisadane River every morning.",
      "She works at Pasar Lama Tangerang.",
      "The angklung players perform at Benteng Heritage on weekends.",
      "We eat laksa Tangerang every Sunday.",
    ],
    [
      "I do not visit Museum Benteng on Mondays.",
      "He does not like sayur besan.",
      "They do not live near Sungai Cisadane.",
      "The shop does not open before nine.",
    ],
    [
      "Do you live in Tangerang?",
      "Does she cook nasi sumsum every weekend?",
      "Do they sell laksa at Pasar Lama?",
      "Does the museum open at ten?",
    ],
    [
      "Don't you live in Tangerang?",
      "Doesn't she cook nasi sumsum every weekend?",
      "Don't they sell laksa at Pasar Lama?",
      "Doesn't the museum open at ten?",
    ],
    [
      "Tangerang sits on the banks of the Cisadane River.",
      "Many tourists visit Benteng Heritage every year.",
      "Cina Benteng families celebrate Cap Go Meh every February.",
    ],
    ["every day", "always", "usually", "often", "sometimes", "never", "on Sundays"],
    ["Daily habits", "General facts", "Scheduled events", "Permanent situations"]
  ),
  T(
    "present-continuous", "Present Continuous", "Present Continuous Tense", "present",
    "Used for actions happening right now or around the present moment.",
    {
      positive: "S + am/is/are + V-ing + O",
      negative: "S + am/is/are + not + V-ing + O",
      interrogative: "Am/Is/Are + S + V-ing + O ?",
      negativeInterrogative: "Aren't/Isn't + S + V-ing + O ?",
    },
    [
      "I am crossing the Cisadane bridge right now.",
      "She is buying dodol at Pasar Lama.",
      "We are watching the barongsai performance at Benteng Heritage.",
      "The vendors are setting up their stalls this morning.",
    ],
    [
      "I am not walking to the museum at the moment.",
      "He is not eating laksa today.",
      "They are not staying near Cisadane this week.",
      "She is not working at the bakery now.",
    ],
    [
      "Are you visiting Benteng Heritage today?",
      "Is she taking photos at Pasar Lama?",
      "Are they crossing the river by boat?",
      "Is he learning to make kue keranjang?",
    ],
    [
      "Aren't you visiting Benteng Heritage today?",
      "Isn't she taking photos at Pasar Lama?",
      "Aren't they crossing the river by boat?",
      "Isn't he learning to make kue keranjang?",
    ],
    [
      "The Cisadane River is flowing faster than usual today.",
      "A barongsai troupe is parading through Pasar Lama right now.",
      "Tourists are tasting fresh laksa at the corner stall.",
    ],
    ["now", "right now", "at the moment", "currently", "today", "this week"],
    ["Actions in progress", "Temporary situations", "Changing trends"]
  ),
  T(
    "present-perfect", "Present Perfect", "Present Perfect Tense", "present",
    "Used for actions completed at an unspecified time before now, with a result that affects the present.",
    {
      positive: "S + have/has + V3 + O",
      negative: "S + have/has + not + V3 + O",
      interrogative: "Have/Has + S + V3 + O ?",
      negativeInterrogative: "Haven't/Hasn't + S + V3 + O ?",
    },
    [
      "I have visited Museum Benteng three times.",
      "She has lived in Tangerang since 2010.",
      "We have already eaten laksa today.",
      "He has finished restoring the old Cina Benteng house.",
    ],
    [
      "I have not crossed the Cisadane bridge yet.",
      "She has not tried sayur besan before.",
      "They have not opened the new shop yet.",
      "He has not seen the barongsai parade this year.",
    ],
    [
      "Have you been to Pasar Lama before?",
      "Has she tried dodol Tangerang yet?",
      "Have they finished the river clean-up?",
      "Has the museum opened the new exhibition?",
    ],
    [
      "Haven't you been to Pasar Lama before?",
      "Hasn't she tried dodol Tangerang yet?",
      "Haven't they finished the river clean-up?",
      "Hasn't the museum opened the new exhibition?",
    ],
    [
      "The Cisadane has flooded several times this year.",
      "Tangerang has grown rapidly over the last decade.",
      "Many Cina Benteng families have preserved their traditions for generations.",
    ],
    ["already", "yet", "just", "ever", "never", "since", "for", "recently"],
    ["Past action with present result", "Life experiences", "Unfinished time periods"]
  ),
  T(
    "present-perfect-continuous", "Present Perfect Continuous", "Present Perfect Continuous Tense", "present",
    "Used for actions that started in the past and are still continuing, or just finished, with focus on duration.",
    {
      positive: "S + have/has + been + V-ing + O",
      negative: "S + have/has + not + been + V-ing + O",
      interrogative: "Have/Has + S + been + V-ing + O ?",
      negativeInterrogative: "Haven't/Hasn't + S + been + V-ing + O ?",
    },
    [
      "I have been studying the history of Benteng Heritage for two hours.",
      "She has been selling laksa at Pasar Lama since morning.",
      "We have been walking along the Cisadane all afternoon.",
      "They have been restoring the old shophouse for months.",
    ],
    [
      "I have not been waiting long at the museum.",
      "He has not been working at the stall today.",
      "They have not been living here for long.",
      "She has not been learning Mandarin for years.",
    ],
    [
      "Have you been waiting for the boat tour?",
      "Has she been teaching Mandarin at the heritage school?",
      "Have they been cleaning the Cisadane riverbank?",
      "Has it been raining in Tangerang all day?",
    ],
    [
      "Haven't you been waiting for the boat tour?",
      "Hasn't she been teaching Mandarin at the heritage school?",
      "Haven't they been cleaning the Cisadane riverbank?",
      "Hasn't it been raining in Tangerang all day?",
    ],
    [
      "The community has been preserving Cap Go Meh traditions for centuries.",
      "Vendors have been opening earlier since the new market reopened.",
      "Children have been swimming in the Cisadane safely after the cleanup.",
    ],
    ["for", "since", "lately", "recently", "all day", "all morning"],
    ["Duration of an ongoing action", "Recently completed continuous actions"]
  ),

  // ---------- PAST ----------
  T(
    "simple-past", "Simple Past", "Past Tense", "past",
    "Used for actions completed at a specific time in the past.",
    {
      positive: "S + V2 + O",
      negative: "S + did + not + V1 + O",
      interrogative: "Did + S + V1 + O ?",
      negativeInterrogative: "Didn't + S + V1 + O ?",
    },
    [
      "I visited Benteng Heritage last weekend.",
      "She bought dodol at Pasar Lama yesterday.",
      "We watched the barongsai parade in February.",
      "The Cisadane flooded the lowlands in 2020.",
    ],
    [
      "I did not eat laksa yesterday.",
      "He did not visit the museum last month.",
      "They did not attend Cap Go Meh last year.",
      "She did not walk to school this morning.",
    ],
    [
      "Did you visit Pasar Lama yesterday?",
      "Did she buy kue keranjang last week?",
      "Did they restore the old building in 2019?",
      "Did the festival start at noon?",
    ],
    [
      "Didn't you visit Pasar Lama yesterday?",
      "Didn't she buy kue keranjang last week?",
      "Didn't they restore the old building in 2019?",
      "Didn't the festival start at noon?",
    ],
    [
      "The Dutch built the original fort by the Cisadane in the 17th century.",
      "Chinese traders settled in Tangerang hundreds of years ago.",
      "Our family tried sayur besan at a wedding last month.",
    ],
    ["yesterday", "last week", "last year", "ago", "in 2010", "when I was young"],
    ["Completed past actions", "Past habits", "Series of past events"]
  ),
  T(
    "past-continuous", "Past Continuous", "Past Continuous Tense", "past",
    "Used for actions that were in progress at a specific moment in the past, or interrupted by another action.",
    {
      positive: "S + was/were + V-ing + O",
      negative: "S + was/were + not + V-ing + O",
      interrogative: "Was/Were + S + V-ing + O ?",
      negativeInterrogative: "Wasn't/Weren't + S + V-ing + O ?",
    },
    [
      "I was crossing the Cisadane bridge when it started raining.",
      "She was buying laksa when she met her friend.",
      "We were exploring Benteng Heritage at noon yesterday.",
      "They were rehearsing for the Cap Go Meh parade all evening.",
    ],
    [
      "I was not waiting at the museum gate.",
      "He was not eating at the stall.",
      "They were not watching the parade.",
      "She was not living here last year.",
    ],
    [
      "Were you walking by the river when it rained?",
      "Was she taking photos at Pasar Lama?",
      "Were they preparing the festival decorations?",
      "Was he learning to play angklung last month?",
    ],
    [
      "Weren't you walking by the river when it rained?",
      "Wasn't she taking photos at Pasar Lama?",
      "Weren't they preparing the festival decorations?",
      "Wasn't he learning to play angklung last month?",
    ],
    [
      "The barongsai was performing while the crowd cheered.",
      "Vendors were closing their stalls when the rain began.",
      "We were watching the sunset over the Cisadane.",
    ],
    ["while", "when", "as", "all day yesterday", "at 5 pm yesterday"],
    ["Past actions in progress", "Interrupted past actions", "Parallel past actions"]
  ),
  T(
    "past-perfect", "Past Perfect", "Past Perfect Tense", "past",
    "Used for an action completed before another past action — the 'past of the past'.",
    {
      positive: "S + had + V3 + O",
      negative: "S + had + not + V3 + O",
      interrogative: "Had + S + V3 + O ?",
      negativeInterrogative: "Hadn't + S + V3 + O ?",
    },
    [
      "I had visited Benteng Heritage before I moved to Tangerang.",
      "She had eaten laksa before the rain started.",
      "We had finished the tour before the museum closed.",
      "They had restored the shophouse before the festival began.",
    ],
    [
      "I had not seen the barongsai before last year.",
      "He had not tried sayur besan before the wedding.",
      "They had not visited Pasar Lama before yesterday.",
      "She had not learned Mandarin before moving here.",
    ],
    [
      "Had you been to the museum before that day?",
      "Had she tasted dodol before the trip?",
      "Had they finished the parade before the storm?",
      "Had the river flooded before that year?",
    ],
    [
      "Hadn't you been to the museum before that day?",
      "Hadn't she tasted dodol before the trip?",
      "Hadn't they finished the parade before the storm?",
      "Hadn't the river flooded before that year?",
    ],
    [
      "By 1900 traders had already established Pasar Lama as a hub.",
      "She had crossed the bridge before the boats arrived.",
      "We had left the market before the rain.",
    ],
    ["before", "after", "by the time", "already", "just", "by 2020"],
    ["Past action before another past action", "Reported speech context"]
  ),
  T(
    "past-perfect-continuous", "Past Perfect Continuous", "Past Perfect Continuous Tense", "past",
    "Used for ongoing actions that started and continued before another past action.",
    {
      positive: "S + had + been + V-ing + O",
      negative: "S + had + not + been + V-ing + O",
      interrogative: "Had + S + been + V-ing + O ?",
      negativeInterrogative: "Hadn't + S + been + V-ing + O ?",
    },
    [
      "I had been walking along the Cisadane for an hour before it rained.",
      "She had been selling laksa for years before she retired.",
      "We had been exploring Pasar Lama all morning when we met her.",
      "They had been restoring the temple for months before the opening.",
    ],
    [
      "I had not been waiting long when the boat arrived.",
      "He had not been working there for long.",
      "They had not been living in Tangerang before that year.",
      "She had not been studying Mandarin for long.",
    ],
    [
      "Had you been waiting long at the museum?",
      "Had she been teaching at the heritage school?",
      "Had they been cleaning the riverbank all week?",
      "Had it been raining before you arrived?",
    ],
    [
      "Hadn't you been waiting long at the museum?",
      "Hadn't she been teaching at the heritage school?",
      "Hadn't they been cleaning the riverbank all week?",
      "Hadn't it been raining before you arrived?",
    ],
    [
      "The community had been preparing Cap Go Meh for weeks before the parade.",
      "Vendors had been packing up when the rain finally stopped.",
      "We had been searching for the best laksa for hours.",
    ],
    ["for", "since", "before", "until", "by the time"],
    ["Duration of past action before another past event"]
  ),

  // ---------- FUTURE ----------
  T(
    "simple-future", "Simple Future", "Future Tense", "future",
    "Used for actions that will happen in the future — predictions, decisions, promises.",
    {
      positive: "S + will + V1 + O",
      negative: "S + will + not + V1 + O",
      interrogative: "Will + S + V1 + O ?",
      negativeInterrogative: "Won't + S + V1 + O ?",
    },
    [
      "I will visit Benteng Heritage next weekend.",
      "She will buy laksa at Pasar Lama tomorrow.",
      "We will join the Cap Go Meh parade next year.",
      "The boats will leave the Cisadane pier at sunrise.",
    ],
    [
      "I will not travel to Tangerang next month.",
      "He will not eat at the stall today.",
      "They will not attend the festival.",
      "She will not move to a new house this year.",
    ],
    [
      "Will you join us at Pasar Lama tomorrow?",
      "Will she try sayur besan next week?",
      "Will they reopen the museum in June?",
      "Will the river overflow this season?",
    ],
    [
      "Won't you join us at Pasar Lama tomorrow?",
      "Won't she try sayur besan next week?",
      "Won't they reopen the museum in June?",
      "Won't the river overflow this season?",
    ],
    [
      "The festival will brighten Pasar Lama this Cap Go Meh.",
      "Tangerang will welcome more tourists next year.",
      "Our family will visit the Benteng Heritage Museum on Sunday.",
    ],
    ["tomorrow", "next week", "next year", "soon", "in 2030"],
    ["Predictions", "Spontaneous decisions", "Promises", "Future facts"]
  ),
  T(
    "future-continuous", "Future Continuous", "Future Continuous Tense", "future",
    "Used for actions that will be in progress at a specific moment in the future.",
    {
      positive: "S + will + be + V-ing + O",
      negative: "S + will + not + be + V-ing + O",
      interrogative: "Will + S + be + V-ing + O ?",
      negativeInterrogative: "Won't + S + be + V-ing + O ?",
    },
    [
      "I will be walking along the Cisadane at sunrise tomorrow.",
      "She will be cooking laksa during the festival.",
      "We will be watching the parade at this time tomorrow.",
      "They will be performing barongsai all evening.",
    ],
    [
      "I will not be waiting at the museum at noon.",
      "He will not be working tomorrow morning.",
      "They will not be staying near Pasar Lama.",
      "She will not be teaching Mandarin next week.",
    ],
    [
      "Will you be visiting Tangerang next month?",
      "Will she be cooking sayur besan at the wedding?",
      "Will they be cleaning the Cisadane this weekend?",
      "Will he be playing angklung tonight?",
    ],
    [
      "Won't you be visiting Tangerang next month?",
      "Won't she be cooking sayur besan at the wedding?",
      "Won't they be cleaning the Cisadane this weekend?",
      "Won't he be playing angklung tonight?",
    ],
    [
      "The community will be celebrating Cap Go Meh all night.",
      "We will be sailing on the Cisadane this Sunday.",
      "Tourists will be taking photos of the old fort tomorrow.",
    ],
    ["at this time tomorrow", "all day tomorrow", "at 8 pm tonight"],
    ["Actions in progress in the future", "Polite enquiries about plans"]
  ),
  T(
    "future-perfect", "Future Perfect", "Future Perfect Tense", "future",
    "Used for actions that will be completed before a specific time in the future.",
    {
      positive: "S + will + have + V3 + O",
      negative: "S + will + not + have + V3 + O",
      interrogative: "Will + S + have + V3 + O ?",
      negativeInterrogative: "Won't + S + have + V3 + O ?",
    },
    [
      "I will have visited Benteng Heritage by next Sunday.",
      "She will have finished cooking laksa by noon.",
      "We will have explored Pasar Lama by lunchtime.",
      "The team will have restored the old shophouse by 2027.",
    ],
    [
      "I will not have eaten before the parade.",
      "He will not have finished the tour by 5 pm.",
      "They will not have completed the renovation this year.",
      "She will not have learned Mandarin by then.",
    ],
    [
      "Will you have arrived at Tangerang by evening?",
      "Will she have made dodol by tomorrow?",
      "Will they have finished cleaning the river by Friday?",
      "Will he have written the article by next week?",
    ],
    [
      "Won't you have arrived at Tangerang by evening?",
      "Won't she have made dodol by tomorrow?",
      "Won't they have finished cleaning the river by Friday?",
      "Won't he have written the article by next week?",
    ],
    [
      "By the festival's end, vendors will have sold thousands of bowls of laksa.",
      "By 2030, Tangerang will have transformed its riverside.",
      "By next month, the museum will have welcomed 10,000 visitors.",
    ],
    ["by", "by then", "by tomorrow", "by next week", "before"],
    ["Action completed before a future time"]
  ),
  T(
    "future-perfect-continuous", "Future Perfect Continuous", "Future Perfect Continuous Tense", "future",
    "Used for actions that will continue up until a point in the future, emphasising duration.",
    {
      positive: "S + will + have + been + V-ing + O",
      negative: "S + will + not + have + been + V-ing + O",
      interrogative: "Will + S + have + been + V-ing + O ?",
      negativeInterrogative: "Won't + S + have + been + V-ing + O ?",
    },
    [
      "By next month, I will have been studying tenses for a year.",
      "By 2030, she will have been working at the heritage school for ten years.",
      "By Sunday, we will have been cleaning the Cisadane for a week.",
      "By the end of the year, they will have been restoring the temple for two years.",
    ],
    [
      "I will not have been waiting long when you arrive.",
      "He will not have been working there for long.",
      "They will not have been living here for years.",
      "She will not have been teaching for that long.",
    ],
    [
      "Will you have been waiting long by then?",
      "Will she have been teaching for ten years by 2030?",
      "Will they have been cleaning the river for a month?",
      "Will it have been raining all day by evening?",
    ],
    [
      "Won't you have been waiting long by then?",
      "Won't she have been teaching for ten years by 2030?",
      "Won't they have been cleaning the river for a month?",
      "Won't it have been raining all day by evening?",
    ],
    [
      "By Cap Go Meh, the troupe will have been rehearsing for months.",
      "By 2040, the city will have been investing in heritage projects for two decades.",
      "By sunset, we will have been walking along the Cisadane for hours.",
    ],
    ["by", "for", "by then", "by 2030"],
    ["Duration of a future action up to a future point"]
  ),

  // ---------- PAST FUTURE ----------
  T(
    "past-future", "Past Future", "Past Future Tense", "past-future",
    "Used to describe a future seen from a point in the past — often in reported speech.",
    {
      positive: "S + would/should + V1 + O",
      negative: "S + would/should + not + V1 + O",
      interrogative: "Would/Should + S + V1 + O ?",
      negativeInterrogative: "Wouldn't/Shouldn't + S + V1 + O ?",
    },
    [
      "I said I would visit Benteng Heritage the next day.",
      "She told us she would buy laksa later.",
      "We promised we would join the Cap Go Meh parade.",
      "He said he would meet us at the Cisadane pier.",
    ],
    [
      "I said I would not eat before the festival.",
      "He claimed he would not move out of Tangerang.",
      "They said they would not attend the parade.",
      "She said she would not learn Mandarin.",
    ],
    [
      "Would you visit Pasar Lama with us?",
      "Would she try sayur besan at the wedding?",
      "Would they finish the restoration on time?",
      "Would the boat arrive before sunset?",
    ],
    [
      "Wouldn't you visit Pasar Lama with us?",
      "Wouldn't she try sayur besan at the wedding?",
      "Wouldn't they finish the restoration on time?",
      "Wouldn't the boat arrive before sunset?",
    ],
    [
      "He said the parade would begin at noon.",
      "We knew the museum would close early that day.",
      "She thought the rain would stop by evening.",
    ],
    ["the next day", "later", "the following week", "soon after"],
    ["Future seen from the past", "Reported speech", "Polite past requests"]
  ),
  T(
    "past-future-continuous", "Past Future Continuous", "Past Future Continuous Tense", "past-future",
    "Used to describe an action that would be in progress at a future time, seen from the past.",
    {
      positive: "S + would + be + V-ing + O",
      negative: "S + would + not + be + V-ing + O",
      interrogative: "Would + S + be + V-ing + O ?",
      negativeInterrogative: "Wouldn't + S + be + V-ing + O ?",
    },
    [
      "I said I would be walking along the Cisadane at sunrise.",
      "She told us she would be cooking laksa during the festival.",
      "We knew they would be performing barongsai all evening.",
      "He said he would be working at the museum that afternoon.",
    ],
    [
      "I said I would not be waiting at the gate.",
      "He claimed he would not be working that day.",
      "They said they would not be staying long.",
      "She told us she would not be teaching that morning.",
    ],
    [
      "Would you be visiting Tangerang at that time?",
      "Would she be cooking sayur besan all afternoon?",
      "Would they be cleaning the river the next day?",
      "Would he be playing angklung that evening?",
    ],
    [
      "Wouldn't you be visiting Tangerang at that time?",
      "Wouldn't she be cooking sayur besan all afternoon?",
      "Wouldn't they be cleaning the river the next day?",
      "Wouldn't he be playing angklung that evening?",
    ],
    [
      "They announced they would be hosting Cap Go Meh that weekend.",
      "We knew the boats would be running until midnight.",
      "She thought the rain would be falling all night.",
    ],
    ["at that time", "the next day", "that afternoon", "all evening"],
    ["Ongoing future action from a past viewpoint"]
  ),
  T(
    "past-future-perfect", "Past Future Perfect", "Past Future Perfect Tense", "past-future",
    "Used for an action that would have been completed by a future time, seen from the past.",
    {
      positive: "S + would + have + V3 + O",
      negative: "S + would + not + have + V3 + O",
      interrogative: "Would + S + have + V3 + O ?",
      negativeInterrogative: "Wouldn't + S + have + V3 + O ?",
    },
    [
      "I thought I would have visited Benteng Heritage by then.",
      "She believed she would have finished cooking laksa by noon.",
      "We hoped we would have explored Pasar Lama by lunchtime.",
      "They expected the temple would have been restored by 2025.",
    ],
    [
      "I said I would not have eaten before the parade.",
      "He thought he would not have finished by 5 pm.",
      "They expected they would not have completed the work.",
      "She said she would not have learned Mandarin in time.",
    ],
    [
      "Would you have arrived at Tangerang by evening?",
      "Would she have made dodol by morning?",
      "Would they have finished cleaning the river?",
      "Would the museum have opened by then?",
    ],
    [
      "Wouldn't you have arrived at Tangerang by evening?",
      "Wouldn't she have made dodol by morning?",
      "Wouldn't they have finished cleaning the river?",
      "Wouldn't the museum have opened by then?",
    ],
    [
      "By the festival's end, vendors would have sold thousands of bowls of laksa.",
      "By 2025, they thought the riverside would have been transformed.",
      "By the next month, the museum would have welcomed many visitors.",
    ],
    ["by then", "by tomorrow", "by the next day", "before"],
    ["Action completed before a future point, viewed from the past"]
  ),
  T(
    "past-future-perfect-continuous", "Past Future Perfect Continuous", "Past Future Perfect Continuous Tense", "past-future",
    "Used for an ongoing action that would have continued up to a future point, seen from the past.",
    {
      positive: "S + would + have + been + V-ing + O",
      negative: "S + would + not + have + been + V-ing + O",
      interrogative: "Would + S + have + been + V-ing + O ?",
      negativeInterrogative: "Wouldn't + S + have + been + V-ing + O ?",
    },
    [
      "I thought I would have been studying tenses for a year by that month.",
      "She believed she would have been working at the school for ten years.",
      "We hoped we would have been cleaning the river for a week.",
      "They expected they would have been restoring the temple for two years.",
    ],
    [
      "I said I would not have been waiting long.",
      "He thought he would not have been working there for long.",
      "They said they would not have been living there for years.",
      "She said she would not have been teaching that long.",
    ],
    [
      "Would you have been waiting long by then?",
      "Would she have been teaching for ten years by 2030?",
      "Would they have been cleaning the river for a month?",
      "Would it have been raining all day by evening?",
    ],
    [
      "Wouldn't you have been waiting long by then?",
      "Wouldn't she have been teaching for ten years by 2030?",
      "Wouldn't they have been cleaning the river for a month?",
      "Wouldn't it have been raining all day by evening?",
    ],
    [
      "By Cap Go Meh, they said the troupe would have been rehearsing for months.",
      "By 2040, planners predicted the city would have been investing in heritage for decades.",
      "By sunset, we thought we would have been walking for hours.",
    ],
    ["by then", "for", "by the next day"],
    ["Duration of future action up to a future point, from a past viewpoint"]
  ),
];

const PRONOUNS = ["I", "You", "He", "She", "It", "We", "They"] as const;

function auxFor(pronoun: string, type: "do" | "be-present" | "be-past" | "have") {
  const isThirdSingular = pronoun === "He" || pronoun === "She" || pronoun === "It";
  if (type === "do") return isThirdSingular ? "does" : "do";
  if (type === "be-present") return pronoun === "I" ? "am" : isThirdSingular ? "is" : "are";
  if (type === "be-past") return isThirdSingular || pronoun === "I" ? "was" : "were";
  if (type === "have") return isThirdSingular ? "has" : "have";
  return "";
}

export function getPronounFormulas(tense: Tense): PronounFormula[] {
  const f = tense.formula;
  return PRONOUNS.map((pronoun) => {
    let positive = f.positive;
    let negative = f.negative;
    let interrogative = f.interrogative;

    let negativeInterrogative = f.negativeInterrogative;
negativeInterrogative = negativeInterrogative.replace(/\bS\b/, pronoun);

if (/Don't\/Doesn't/.test(negativeInterrogative)) {
  const aux = auxFor(pronoun, "do");
  negativeInterrogative = negativeInterrogative.replace(/Don't\/Doesn't/g, aux === "do" ? "Don't" : "Doesn't");
}
if (/Aren't\/Isn't/.test(negativeInterrogative)) {
  const aux = auxFor(pronoun, "be-present");
  negativeInterrogative = negativeInterrogative.replace(/Aren't\/Isn't/g, aux === "am" ? "Am not" : aux === "is" ? "Isn't" : "Aren't");
}
if (/Wasn't\/Weren't/.test(negativeInterrogative)) {
  const aux = auxFor(pronoun, "be-past");
  negativeInterrogative = negativeInterrogative.replace(/Wasn't\/Weren't/g, aux === "was" ? "Wasn't" : "Weren't");
}
if (/Haven't\/Hasn't/.test(negativeInterrogative)) {
  const aux = auxFor(pronoun, "have");
  negativeInterrogative = negativeInterrogative.replace(/Haven't\/Hasn't/g, aux === "have" ? "Haven't" : "Hasn't");
}

return { pronoun, positive, negative, interrogative, negativeInterrogative };
  });
}

export const TENSES_BY_SLUG: Record<string, Tense> = Object.fromEntries(
  TENSES.map((t) => [t.slug, t])
);

export const CATEGORIES: { key: TenseCategory; label: string; description: string }[] = [
  { key: "present", label: "Present", description: "Habits, ongoing actions, and timeless truths." },
  { key: "past", label: "Past", description: "Stories and events already completed." },
  { key: "future", label: "Future", description: "Plans, predictions, and what's to come." },
  { key: "past-future", label: "Past Future", description: "The future seen from a moment in the past." },
];

export function tensesByCategory(cat: TenseCategory) {
  return TENSES.filter((t) => t.category === cat);
}
