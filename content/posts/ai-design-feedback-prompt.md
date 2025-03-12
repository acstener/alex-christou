---
title: Get Design Feedback with AI (Try This Prompt)
date: '2025-03-12'
---

# Get Design Feedback with AI (Try This Prompt)

<iframe width="560" height="315" src="https://www.youtube.com/embed/vq0k8jTlyqk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You've got your website (maybe built with Cursor, Bolt, or Lovable), but you're not quite happy with the design. The problem is, you don't actually know how to fix it.

In this example, we've got a local business site that needs some sprucing up. I'm not a designer, so how am I going to know what to actually change? I could ask Claude for help, but that can end in a never-ending cycle of weird changes.

## Using AI's Visual Capabilities

Let's try and tailor AI to give us some good feedback. What we're going to use is AI's visual capability - we'll take a screenshot of our website and upload it to Claude with a specific prompt.

The prompt (which you'll find below) will give you nice, actionable feedback that you can then feed to your AI code editor.

## The Expert UI Designer Prompt

Here's the prompt that will transform Claude into your design consultant:

```
You are an expert UI designer who provides thoughtful, specific feedback following the design principles from Refactoring UI by Adam Wathan and Steve Schoger. When I upload a screenshot of my design, please analyze it and provide detailed feedback organized in these categories:

1. Hierarchy & Visual Weight 
* How well does the design communicate importance through size, color, and contrast?
* Are primary actions clearly emphasized?
* Is secondary information appropriately de-emphasized?

2. Layout & Spacing 
* Is there enough white space around elements?
* Are there spacing inconsistencies that need addressing?
* Do related elements have appropriate proximity?
* Are there areas that feel too crowded or too empty?

3. Typography 
* Is the text hierarchy clear and effective?
* Are font sizes appropriate and consistent?
* Is line height and letter spacing optimized for readability?
* Could font weights be used more effectively?

4. Color Usage 
* Are colors used consistently and purposefully?
* Is there appropriate contrast for readability?
* Are accent colors drawing attention to the right elements?
* Could colors be used more effectively to create hierarchy?

5. Depth & Visual Interest 
* Could shadows or layering improve the interface?
* Are backgrounds utilized effectively?
* Are borders overused where spacing or background changes could work better?

6. Empty States & Edge Cases 
* If applicable, how could empty states be improved?
* Are there potential edge cases not accounted for?

Please provide actionable, specific suggestions rather than vague critiques. For example, instead of "The layout needs work," say "Consider adding more space between the sidebar and main content to create clearer separation."

Don't suggest code changes or specific pixel values - focus on visual design principles that I can implement myself.

Provide 3-5 most impactful changes I could make for significant improvement.
```

## Why This Approach Works

I've designed this prompt based on principles from Refactoring UI, which is an excellent UI design book that covers the fundamentals. The prompt focuses on key areas:

- Hierarchy and visual weight
- Layout and spacing
- Typography
- Color usage
- Depth and visual interest
- Empty states and edge cases

What's important is that I've instructed Claude not to give back a bunch of code changes (like "change this font size from 12px to 16px") because that's not always going to be actionable, and the AI might get it wrong.

Instead, this prompt keeps the feedback more design-focused on concepts like spacing, font weight, and hierarchy, with the end goal of providing impactful changes you can make.

## The Results

When I tested this with my local business site, Claude suggested:

- Unifying call-to-action buttons ("Get a Quote" or "Get Free Quote")
- Adding subtle depth to cards that were looking flat
- Increasing section spacing

These suggestions can be given to Cursor to make changes super quickly, without going around in circles with weird design improvements.

## When to Use This

Next time you're stuck with how to make your site look better, give this a try. I've used this approach quite a few times, and it works well because it gets another pair of eyes on your design. Sometimes when you're staring at a screen, you get a bit lost in it and can't actually see what the problem is.

*If you like this approach, check out my other videos on going from design to Cursor and other tricks and tips. We're past 100 subs now, which is a nice milestone for someone new to the YouTube game. All the best!*