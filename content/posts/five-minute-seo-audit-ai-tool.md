---
title: 5 Minute SEO Audit (Try This Tool)
date: '2025-03-12'
---

# 5 Minute SEO Audit with AI (Try This Tool)

<iframe width="560" height="315" src="https://www.youtube.com/embed/zTce3hHILak" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Hello there! Quick video today where we're going to look at how we can use AI to help us out with technical SEO. It's going to be a bit of a sit-alongside as we run through this together.

## When Your SEO Performance Doesn't Look Good

As you can see here, you don't need to know anything about SEO to know that this graph doesn't look good. Here we're showing impressions for a local business site that's not getting any engagement. The structure of the site is pretty simple, so there's no reason it shouldn't be getting more traffic.

Perhaps there are some technical SEO issues? Perhaps there's some duplicate content issues? We're going to find out.

## Using AI to Tackle SEO Problems

Again, let's pretend that we don't really know what we're doing here, and we're going to leverage AI to help us out.

Yes, we could be in Cursor and just say, "Hey, can you do some technical SEO improvements?" But that's kind of firing from the hip - we're not sure what we're going to get there, and it could just trip out on itself.

## A Better Approach: The High-Level Overview

What we're going to do instead is:

1. Get a high-level overview of our whole project
2. Make it into a format that AI can understand
3. Give it to Claude
4. Let Claude analyze the project and recommend what to do
5. Put those recommendations into Cursor to make the changes

## Enter Repo Mix: The Secret Weapon

Here's our project in Cursor (I'm actually using WindSurf, same thing). We want to get this into Claude, but there are a lot of files here.

We're going to use a tool called **Repo Mix**. You need to have your project in GitHub for this to work. Repo Mix essentially goes through your codebase and piles it all into one file, which we can then upload to Claude so it understands the whole project.

To use it:
1. Go to Repo Mix
2. Put in the URL of your repo
3. Let it process your code
4. Copy the output

In my case, it analyzed 89 files and formatted them into a single document that Claude can understand.

## Analyzing the Codebase with Claude

Now we can literally drop that code into Claude. You could use a Claude project (which would probably be better), but for now I'm just using a chat.

I've honestly just given it a pretty loose prompt:
```
Here is the codebase. Good luck, have fun!
```

Since we're using Claude 3.7 Sonnet, hopefully it'll give us some good insights.

## The Results: Technical SEO Issues Identified

Right away, Claude is flagging some duplicate content issues with the site. This is already incredibly useful information.

After analyzing the whole codebase, Claude provides technical SEO recommendations:

1. Add canonical tags
2. Create truly unique location content
3. Implement structured data
4. Optimize the sitemap
5. Create location-specific components

## From Recommendations to Implementation

So how do we go from this to actually making improvements? We'll run through the first one as an example.

I asked Claude to write an in-depth prompt that I can drop into Cursor. Claude provided a detailed explanation of the canonical tag issue and how to implement it.

Now we can:
1. Copy that prompt
2. Open WindSurf/Cursor
3. Paste it into Composer
4. Let the agent chain the steps together

What this will do is add canonical URLs to point to the main page for similar content, so we're not giving Google a bunch of duplicate content that it can't distinguish between.

## The Benefits

After implementing these changes, we should see that Google SEO graph go up a little bit more. 

This approach is powerful because:
1. It gives you expert SEO insights even if you're not an SEO pro
2. It analyzes your entire codebase in context
3. It provides specific, actionable recommendations
4. It can generate the code to implement those changes

If you enjoyed this video and got a bit of value out of it, please hit the like button - I think it helps out the videos. I've got a bunch of other Cursor/AI building tips on design and SEO stuff on my channel, so do check that out and subscribe if you're into this sort of content.

All the best!