import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STORIES } from "@/data/stories";
import { Check } from "lucide-react";
import { useProgress } from "@/lib/progress-store";

export default function StoryShowcase() {
  const [active, setActive] = useState(0);

  const story = STORIES[active];
  const storyProgress = useProgress((s) => s.stories);

  return (
    <section className="mt-24">
      <div className="grid xl:grid-cols-[280px_1fr] gap-14 items-start">

        {/* LEFT */}

        <div className="sticky top-32">

          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Explore Stories
          </p>

          <h2 className="mt-4 text-4xl xl:text-5xl font-semibold leading-tight">
            Every place has
            <br />
            its own tense.
          </h2>

          <div className="relative mt-12 border-l border-white/10">

            {STORIES.map((item, index) => {

              const done =
                storyProgress[item.slug]?.read &&
                storyProgress[item.slug]?.quizPassed;

              return (
                <button
                  key={item.slug}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={`group relative w-full py-7 pl-8 text-left transition-all duration-500 ${
                    active === index
                      ? "opacity-100"
                      : "opacity-40 hover:opacity-80"
                  }`}
                >
                  <span
                    className={`absolute left-[-9px] top-9 h-[18px] w-[18px] rounded-full transition-all duration-500 ${
                      active === index
                        ? "scale-125 border-4 border-blue-300 bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,.8)]"
                        : "border border-zinc-500 bg-zinc-700"
                    }`}
                  />

                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {item.title}
                    </h3>

                    {done && (
                      <Check
                        size={15}
                        className="text-green-400"
                      />
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground line-clamp-2">
                    {item.summary}
                  </p>

                </button>
              );
            })}

          </div>

        </div>

        {/* RIGHT */}

        <AnimatePresence mode="wait">

          <motion.div
            key={story.slug}
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -30,
              scale: 0.98,
            }}
            transition={{
              duration: 0.45,
            }}
            className="
relative
group
min-h-[720px]
overflow-hidden
rounded-[40px]
border
border-white/10
bg-gradient-to-br
from-white/[0.03]
to-white/[0.01]
backdrop-blur-xl
shadow-2xl
transition-all
duration-500
hover:border-blue-500/40
hover:shadow-[0_0_80px_rgba(59,130,246,.18)]
"
          >

            <img
              src={story.image}
              alt={story.title}
              className="
w-full
h-[420px]
object-cover
transition-transform
duration-700
group-hover:scale-105
"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 p-12">

              <span
                className="
inline-flex
rounded-full
border
border-blue-500/20
bg-blue-500/10
px-4
py-2
text-xs
uppercase
tracking-[0.25em]
text-blue-300
"
              >
                {story.tenseFocus}
              </span>

              <h2 className="mt-6 text-6xl xl:text-7xl font-bold leading-none">
                {story.title}
              </h2>

              <p className="mt-8 max-w-3xl text-lg leading-9 text-muted-foreground">
                {story.summary}
              </p>

              <Link
                to="/cerita/$slug"
                params={{
                  slug: story.slug,
                }}
                className="
mt-12
inline-flex
items-center
rounded-full
bg-blue-500
px-7
py-3.5
font-medium
text-white
transition-all
duration-300
hover:scale-105
hover:bg-blue-400
"
              >
                Baca Cerita →
              </Link>

            </div>

          </motion.div>

        </AnimatePresence>

      </div>
    </section>
  );
}