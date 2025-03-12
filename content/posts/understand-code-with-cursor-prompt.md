---
title: Use Cursor to Understand Your Code (Use This Prompt)
date: '2025-03-12'
---

# Use Cursor to Understand Your Code (Use This Prompt)

<iframe width="560" height="315" src="https://www.youtube.com/embed/8yXdTLuSB1A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Everyone's a gangster until you have to vibe debug the vibe code and you realize you have no idea how anything works at all.

I've been hearing this a lot, and I know there's some joking in here, but I've been noticing a lot – especially on Reddit – of people trying to shut down AI coding and people building with Cursor because they "don't understand every line of code."

I tweeted this earlier: there's a huge undertone of devs trying to shut down people using AI to build things, and it's classic gatekeeping. I saw it before with a bunch of no-code tools. There are fair points, but it comes from a negative vibe.

When people say "Oh, you don't understand your code," here's how you can understand your code using Cursor or no-code tools.

## The "Understanding Your Code" Prompt

Let's jump into a real example. Say I built this tool here - a design prompt generator - and it's working, but there's an error or a bug, and I don't know how the code works. I didn't write every line of code.

Here's what we can do. Let's pretend we don't know anything about the file structure in Cursor, that it's all gibberish to me. All we know is the URL.

I'm going to use this prompt:

```
Hey, I've got this flow here for the design prompt generator I made with the URL [your-url-here].

I'm having some issues and really want to understand how this works. Create a step-by-step explanation for me, put simply as I'm new to programming.

Take time to understand how this works. Also, please add comments to the code.
```

## What This Prompt Does

When you run this in Cursor, it's going to:

1. Look at the path and understand how everything's connected
2. Explain it back to you in simple terms
3. As it goes through, you'll be able to see the code and click into it
4. It will add comments to the code so when you go back in the future, you can see what each part does

In my example, Cursor identified the main page, the form component, the screenshot API, and explained what the different APIs are doing and the different states. It added comments throughout, doing a great job of making the code understandable.

If you have any follow-up questions, you can then ask Cursor for more details.

## The Reality of "Vibe Debugging"

Yes, if you're into "vibe coding," you're going to have to "vibe debug" at some point - and it's not really a vibe, it's actually quite hard. Especially the first 50 times you do it, you're going to be banging your head against the wall a lot.

But the same tools that are amazing for building stuff can help with debugging. A big part of programming is debugging and fixing, so use tools like Cursor to understand how things work.

Because a lot of the time, to fix stuff, you kind of have to understand how it works, at least to a certain level. Maybe you can get away with not understanding and just kind of full sending with the AI codebases. And maybe with tools like Bolt or v0, it's more suitable for that approach.

But if you want to get a bit deeper and build some more complex stuff, you will need to understand your code. And Cursor is a great tool to help you do just that.

*If you want some more videos like this, check out the rest of my channel and do subscribe. We've just hit 100 subs, which is good as I'm new to the YouTube game. All the best!*