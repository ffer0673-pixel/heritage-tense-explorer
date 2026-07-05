export interface Story {
  slug: string;
  title: string;
  summary: string;
  cover: string; // emoji or class
  tenseFocus: string;
  body: string[];
  analysis: { sentence: string; tense: string; explanation: string }[];
  image?: string;
}

export const STORIES: Story[] = [
  {
    slug: "sore-di-cisadane",
    title: "Sore di Cisadane",
    summary: "A quiet evening walk along the river reveals a different side of Tangerang.",
    cover: "🌅",
    image: "/sungaicisadane.png",
    tenseFocus: "Present Continuous & Simple Present",
    body: [
      "The sun is setting behind the rooftops of Pasar Lama. I am walking slowly along the Cisadane promenade, watching the orange light spill across the water. A breeze lifts the smell of laksa from a nearby stall.",
      "Every evening the river comes alive. Vendors set up their carts. Children chase each other across Jembatan Berendeng. Old men play chess on plastic chairs by the bank. A row of small boats waits patiently for passengers.",
      "I sit on a low wall and watch a group of teenagers practising the angklung. Their music drifts over the water, soft and uncertain at first, then steadier. The river carries it downstream, past the old fort, past the shophouses, into the city that never quite sleeps.",
    ],
    analysis: [
      { sentence: "The sun is setting behind the rooftops of Pasar Lama.", tense: "Present Continuous", explanation: "An action happening right now in the moment of the story." },
      { sentence: "Every evening the river comes alive.", tense: "Simple Present", explanation: "A regular, habitual fact about the river." },
      { sentence: "A breeze lifts the smell of laksa from a nearby stall.", tense: "Simple Present", explanation: "Describes a general, recurring sensory event." },
      { sentence: "I am walking slowly along the Cisadane promenade.", tense: "Present Continuous", explanation: "An ongoing action happening at this exact moment." },
      { sentence: "Vendors set up their carts.", tense: "Simple Present", explanation: "A habitual action that happens every evening." },
      { sentence: "Their music drifts over the water, soft and uncertain at first.", tense: "Present Continuous", explanation: "Describes an action in progress as the narrator watches." },
    ],
  },
  {
    slug: "kisah-pasar-lama",
    title: "Kisah Pasar Lama",
    summary: "Pak Tan tells how Pasar Lama looked when his grandfather first opened the family shop.",
    cover: "🏮",
    image: "/pasarlama.png",
    tenseFocus: "Simple Past & Past Perfect",
    body: [
      "Pak Tan opened the wooden shutters of his shop and smiled. 'When my grandfather built this place in 1925,' he said, 'the road had not yet been paved. Carts pulled by horses passed in front every morning.'",
      "He pointed at a black-and-white photograph on the wall. 'Before the war started, the family had already grown the business into three stalls. We sold spices, dried fish, and herbs from China.'",
      "Outside, the modern Pasar Lama buzzed with motorbikes and tourists. But inside the old shop, the smell of cinnamon and clove still hung in the air, exactly as it had a hundred years ago.",
    ],
    analysis: [
      { sentence: "Pak Tan opened the wooden shutters of his shop and smiled.", tense: "Simple Past", explanation: "A completed action at a specific point in the past." },
      { sentence: "The road had not yet been paved.", tense: "Past Perfect", explanation: "An action (or non-action) finished before another past moment." },
      { sentence: "The family had already grown the business into three stalls.", tense: "Past Perfect", explanation: "Completed before the past reference point (the war starting)." },
      { sentence: "Carts pulled by horses passed in front every morning.", tense: "Simple Past", explanation: "A repeated past action described as a habit at that time." },
      { sentence: "Outside, the modern Pasar Lama buzzed with motorbikes and tourists.", tense: "Simple Past", explanation: "A completed description of the present-day scene as narrated in the past." },
      { sentence: "We sold spices, dried fish, and herbs from China.", tense: "Simple Past", explanation: "A completed past action recounted by Pak Tan." },
    ],
  },
  {
    slug: "festival-cap-go-meh",
    title: "Festival Cap Go Meh",
    summary: "A neighbourhood prepares for the loudest, brightest night of the year.",
    cover: "🐉",
    image: "/festival.png",
    tenseFocus: "Future & Future Continuous",
    body: [
      "Next Friday, Pasar Lama will become a river of red lanterns. The barongsai troupe will perform along the main street, and the temple drums will echo all the way to the Cisadane.",
      "By midnight, the festival will have welcomed thousands of visitors. Families will be eating laksa at long tables. Children will be chasing each other through the smoke of firecrackers. The whole city will be celebrating Cap Go Meh.",
      "I will be standing at the bridge with my camera, waiting for the dragon to pass. I will not miss this night for anything.",
    ],
    analysis: [
      { sentence: "Next Friday, Pasar Lama will become a river of red lanterns.", tense: "Simple Future", explanation: "A prediction about a future event." },
      { sentence: "By midnight, the festival will have welcomed thousands of visitors.", tense: "Future Perfect", explanation: "An action completed before a future time." },
      { sentence: "I will be standing at the bridge with my camera.", tense: "Future Continuous", explanation: "An action that will be in progress at a future moment." },
      { sentence: "The barongsai troupe will perform along the main street.", tense: "Simple Future", explanation: "A planned future event being predicted." },
      { sentence: "Families will be eating laksa at long tables.", tense: "Future Continuous", explanation: "An action in progress at a specific future time (midnight)." },
      { sentence: "The whole city will be celebrating Cap Go Meh.", tense: "Future Continuous", explanation: "An ongoing future action happening across the city that night." },
    ],
  },
  {
    slug: "rumah-tua-benteng",
    title: "Rumah Tua Benteng",
    summary: "She thought the old Cina-Benteng house would have crumbled by now — but it hadn't.",
    cover: "🏠",
    image:"/rumahtuabentng.png",
    tenseFocus: "Past Future Perfect & Past Perfect",
    body: [
      "Mei had not seen the family house for twenty years. She thought the roof would have collapsed and the garden would have disappeared. As her taxi turned the corner, she held her breath.",
      "But the house was still there. Someone had painted the walls a soft cream. Someone had replaced the broken tiles. A neighbour told her that the heritage council had been restoring Cina-Benteng houses for years.",
      "She stepped through the gate and smiled. The future she had feared had not arrived. Instead, the past had been quietly cared for, waiting for her to come home.",
    ],
    analysis: [
      { sentence: "She thought the roof would have collapsed.", tense: "Past Future Perfect", explanation: "A future-from-the-past action she expected to have been completed." },
      { sentence: "Someone had painted the walls a soft cream.", tense: "Past Perfect", explanation: "Action completed before another past moment (her arrival)." },
      { sentence: "The heritage council had been restoring Cina-Benteng houses for years.", tense: "Past Perfect Continuous", explanation: "Ongoing action that had continued up to a past reference point." },
      { sentence: "Mei had not seen the family house for twenty years.", tense: "Past Perfect", explanation: "An action (or absence of action) that continued up until a past point." },
      { sentence: "The garden would have disappeared.", tense: "Past Future Perfect", explanation: "An expected outcome from the past, viewed as completed in an imagined future." },
      { sentence: "The future she had feared had not arrived.", tense: "Past Perfect", explanation: "Describes something that had not happened before another past reference point." },
    ],
  },
  {
    slug: "kuliner-tangerang",
    title: "Kuliner Tangerang",
    summary: "Tangerang cuisine fuses Sundanese, Chinese, and Betawi flavors — laksa, sayur besan, and dodol.",
    cover: "🍜",
    image: "/kulinertangerang.png",
    tenseFocus: "Present Perfect & Simple Present",
    body: [
      "We are sitting at a wooden table in Pasar Lama, surrounded by the steam of boiling laksa broth. The aroma of roasted coconut and coriander fills the air as the chef prepares our bowls.",
      "Tangerang's culinary heritage tells the story of centuries of cultural fusion. Every bowl of Laksa Tangerang combines local Sundanese rice noodles with Chinese spices and Betawi style gravy.",
      "By the time we finish our sayur besan and sweet, sticky dodol, we will have experienced a true taste of Tangerang's Peranakan history.",
    ],
    analysis: [
      { sentence: "The aroma of roasted coconut and coriander fills the air.", tense: "Simple Present", explanation: "Describes a general sensory fact in the story." },
      { sentence: "We will have experienced a true taste of Tangerang's history.", tense: "Future Perfect", explanation: "An action that will be completed before a future point." },
    ],
  },
];