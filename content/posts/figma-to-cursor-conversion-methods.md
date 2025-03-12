---
title: 4 Ways to Go From Figma to Cursor
date: '2025-03-12'
---

# 4 Ways to Go From Figma to Cursor

<iframe width="560" height="315" src="https://www.youtube.com/embed/UtL5aK6Zw58" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Let's be honest, recreating UIs in code isn't the best way to spend your time, and it's probably not your strongest skill. So let's look at four different ways you can go from Figma to Cursor (or to code in general).

## Method 1: The Simple Screenshot

This method is surprisingly effective. Just take a screenshot of your Figma design and ask Cursor to recreate it.

Here's what you do:
1. Take a screenshot of your Figma design
2. Open Cursor and upload the image
3. Ask: "Can you recreate this page please?"

The results are surprisingly decent. In my test, it got the text, icons, navigation, and fonts pretty well. Not a million miles off from the original design!

This works well if you're looking for a good starting point. Plus, you can upload multiple screenshots from similar pages to give Cursor a better idea of the styling, look and feel.

## Method 2: The Enhanced Prompt

For this method, I took the same screenshot to Claude and asked it to create a detailed prompt that would help Cursor recreate the design.

The prompt included:
- Information about the header and nav
- Details about the hero section and visual elements
- Color scheme and typography specifications

When I put this prompt into Cursor, the results were pretty good - similar to the screenshot method but with a bit more control. Again, it took only about 90 seconds to generate, which is impressive.

## Method 3: Figma Dev Mode

If you're on a paid Figma plan (which I'm not, so I'm showing docs), you can use Figma Dev Mode.

This allows you to export the variables of the component or design - padding, margins, dimensions, etc. If your design team keeps a good component library, you can just reuse those components.

We used this at a startup I worked at. The results weren't amazing, but if you're after pixel perfection, it's probably a decent approach. It serves a slightly different purpose than the first two methods.

## Method 4: Builder.io Figma Plugin

This is probably the most impressive method. Using the Builder.io plugin for Figma:

1. Select your design in Figma
2. Go to Plugins > Builder.io
3. The plugin uses AI to process all the layers and create code
4. You can open in Builder (a visual web builder) or in Lovable

When you open in Lovable, you get all the code from the Figma design, which you can easily grab and put into Cursor. The font sizes might be a bit off, but overall the plugin is impressive.

You can also open the repo directly in GitHub, which is cool.

## The Verdict

Each method has its strengths:
- **Screenshot**: Quick, easy, decent starting point
- **Enhanced Prompt**: More control, still very quick
- **Dev Mode**: Good for pixel precision if you have a paid Figma account
- **Builder.io Plugin**: Most accurate, gives you actual code to work with

For a more in-depth test of the Builder.io plugin, check out my dedicated video on it.

*If you found this helpful, subscribe to the channel for more AI development content. Until next time!*