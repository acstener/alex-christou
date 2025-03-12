---
title: Custom Design Prompts for Cursor (with Claude)
date: '2025-03-12'
---

# Creating Custom Design Prompts for Cursor with Claude

<iframe width="560" height="315" src="https://www.youtube.com/embed/zl2rVEYne-Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

We're talking about design prompts today. Let's say you've got a landing page you've built with Cursor, but you're not quite happy with the vibe of the page, the look and feel, the spacing - and perhaps you've got something better in mind. But how are you going to get a prompt for that?

Here's a quick win for you to go from a landing page you like (for example, I like the Linear page) and recreate that vibe or be inspired by it for your own landing page. Let's jump in and see how we can create a design prompt with Claude.

## The Process

1. **Identify Reference Design**: First, find a website design you like (I'm using Linear's site)
2. **Take Screenshots**: Capture several key views/sections of the reference site
3. **Create Design System with Claude**: Use Claude to analyze these screenshots
4. **Implement in Cursor**: Apply the generated design system to your project

## Step 1: Screenshot Your Inspiration

Start by taking a few screenshots of the design you want to emulate. The more you put in, the better results you'll probably get. For this example, I'm grabbing several views of Linear's landing page.

## Step 2: Create a Design System with Claude

Here's the prompt I use with Claude (you'll find this in the video description as well):

```
Create a detailed design system based on the screenshots. Analyze the visual design and create a comprehensive style guide including:

1. Typography:
   - Font families
   - Font sizes and weights
   - Line heights
   - Letter spacing

2. Spacing and Layout:
   - Grid system
   - Margin and padding patterns
   - Section spacing
   - Responsive behavior

3. Components:
   - Button styles
   - Form elements
   - Navigation patterns
   - Cards/containers

4. Color System:
   - Primary, secondary, accent colors
   - Background colors
   - Text colors
   - Gradient patterns

5. Visual Hierarchy:
   - Heading treatments
   - Emphasis patterns
   - Content organization

6. Animation and Interaction:
   - Hover states
   - Transition styles
   - Scrolling behaviors
```

After running this prompt with your screenshots, Claude will generate a comprehensive design system based on your reference design.

## Step 3: Implement in Cursor

Now take that design system output and drop it into Cursor with a prompt like:

"Please update my landing page to be in line with this design system. Think step by step."

I always add "think step by step" at the end of my prompts. It's just a habit, but I usually get good results with that. I think it makes the AI think a bit harder (maybe it doesn't, but it seems to work).

In Cursor, we've got agent mode which chains together all the different actions, so you can go get a cup of tea while this is processing.

## The Results

Is the result the best design we've ever seen? No, it's not. But it does give a starting point for that kind of aesthetic we're working towards.

From here, we can chain together a bunch of other prompts that will help us get closer to our goal. For example, maybe we start on the hero section, look at what Linear is doing that's a bit different, and say "Hey, can you adjust the button like this?" or "Maybe add a gradient to the font" if we really wanted to go after that style of hero.

## Not a Magic Bullet

This isn't a one-shot prompt for getting an amazing design into Cursor. Adding things like images is something that we could do with Cursor quite simply, but getting that perfect design match will take some iteration.

If you're interested in other ways to get designs into Cursor, check out my video on going from Figma to design, and subscribe for more content like this about designing with Cursor. I have a lot more content around that coming soon!

*All the best!*